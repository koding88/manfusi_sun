// Variables to hold constants and solar data
let regionConstants = {};
let northSolarData = [];
let centralSolarData = [];
let southSolarData = [];

// Current region and solar data
let currentRegion = "north";
let currentSolarData = [];
let sunshineCoefficient = 0;
let electricityPrice = 0;
let batteryCoefficient = 0;

// Load all data when document is ready
document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Load constants
        const constantsResponse = await fetch("data_json/constants.json");
        regionConstants = await constantsResponse.json();

        // Load region-specific solar data
        const northDataResponse = await fetch(
            "data_json/north_solar_data.json"
        );
        northSolarData = await northDataResponse.json();

        const centralDataResponse = await fetch(
            "data_json/central_solar_data.json"
        );
        centralSolarData = await centralDataResponse.json();

        const southDataResponse = await fetch(
            "data_json/south_solar_data.json"
        );
        southSolarData = await southDataResponse.json();

        // Initialize with Northern Vietnam data
        currentRegion = "north";
        updateRegionData();

        // Setup UI
        const form = document.getElementById("solar-form");
        const regionSelect = document.getElementById("region");

        // Region change handler
        regionSelect.addEventListener("change", function () {
            currentRegion = this.value;
            updateRegionData();
            updateConstantsDisplay();
            populateOptions();
        });

        // Initial setup
        updateConstantsDisplay();
        populateOptions();

        // Submit handler
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            showLoading();

            // Simulate loading delay
            setTimeout(function () {
                hideLoading();
                calculateSolarSystem();
            }, 800);
        });
    } catch (error) {
        console.error("Error loading data:", error);
        alert("Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.");
    }
});

// Update data based on selected region
function updateRegionData() {
    if (currentRegion === "north") {
        currentSolarData = northSolarData;
        sunshineCoefficient = regionConstants.north.sunshine_coefficient;
        electricityPrice = regionConstants.north.electricity_price;
        batteryCoefficient = regionConstants.north.battery_coefficient;
    } else if (currentRegion === "central") {
        currentSolarData = centralSolarData;
        sunshineCoefficient = regionConstants.central.sunshine_coefficient;
        electricityPrice = regionConstants.central.electricity_price;
        batteryCoefficient = regionConstants.central.battery_coefficient;
    } else if (currentRegion === "south") {
        currentSolarData = southSolarData;
        sunshineCoefficient = regionConstants.south.sunshine_coefficient;
        electricityPrice = regionConstants.south.electricity_price;
        batteryCoefficient = regionConstants.south.battery_coefficient;
    }
}

// Update constants display
function updateConstantsDisplay() {
    const regionName = document.getElementById("region-name");
    const sunshineDisplay = document.getElementById("sunshine-coefficient");
    const electricityDisplay = document.getElementById("electricity-price");
    const batteryDisplay = document.getElementById("battery-coefficient");

    if (currentRegion === "north") {
        regionName.textContent = "Miền Bắc";
        sunshineDisplay.textContent =
            regionConstants.north.sunshine_coefficient;
    } else if (currentRegion === "central") {
        regionName.textContent = "Miền Trung";
        sunshineDisplay.textContent =
            regionConstants.central.sunshine_coefficient;
    } else if (currentRegion === "south") {
        regionName.textContent = "Miền Nam";
        sunshineDisplay.textContent =
            regionConstants.south.sunshine_coefficient;
    }

    electricityDisplay.textContent = electricityPrice.toLocaleString() + " đ";
    batteryDisplay.textContent = batteryCoefficient * 100 + "%";
}

// Populate package options
function populateOptions() {
    const batteryCapacitySelect = document.getElementById("battery-capacity");

    if (!batteryCapacitySelect) {
        console.warn(
            "Could not find the battery capacity select element. Make sure your HTML includes an element with ID 'battery-capacity'."
        );
        return;
    }

    // Keep the default options (no battery, 5.12 kWh battery)
    // The rest of the function that was populating separate package lists is not needed
    // as we're using a simple battery selection dropdown rather than full package selection.
}

// Format currency function
function formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
}

// Calculate payback period in years and months
function formatPaybackPeriod(years, months) {
    if (months === 0) {
        return `${years} năm`;
    } else {
        return `${years} năm ${months} tháng`;
    }
}

// Calculate ROI based on total cost and annual savings
function calculateROI(totalCost, annualSavings) {
    const roi = (annualSavings / totalCost) * 100;
    return `${roi.toFixed(1)}% / năm`;
}

// Find the most suitable package based on user inputs
function findSuitablePackage(monthlyBill, daytimeUsage, batteryCapacity) {
    const needsBattery = batteryCapacity > 0;

    // Filter packages based on battery requirement
    let filteredPackages = currentSolarData.filter(
        (pkg) => pkg.hasBattery === needsBattery
    );

    if (needsBattery) {
        // Further filter by specific battery capacity
        filteredPackages = filteredPackages.filter(
            (pkg) => pkg.batteryCapacity === batteryCapacity
        );
    }

    // Tính toán khả năng phù hợp dựa trên tiền điện hàng tháng
    // Ước tính mức sử dụng điện dựa trên hóa đơn hàng tháng
    const estimatedUsage = monthlyBill / electricityPrice;

    // Sắp xếp các gói theo mức độ phù hợp
    return filteredPackages.sort((a, b) => {
        // Xác định các đầu ra hàng tháng dựa trên cấu trúc dữ liệu
        const aMonthlyOutput = a.monthlyOutput || a.monthlyProduction || 0;
        const bMonthlyOutput = b.monthlyOutput || b.monthlyProduction || 0;

        // Tính toán điểm phù hợp dựa trên:
        // 1. Tiết kiệm hàng tháng phù hợp với mức chi tiêu
        // 2. Công suất hệ thống phù hợp với mức sử dụng điện ban ngày
        const scoreA =
            Math.abs(a.monthlySavings / monthlyBill - daytimeUsage / 100) +
            Math.abs(aMonthlyOutput / estimatedUsage - 1);
        const scoreB =
            Math.abs(b.monthlySavings / monthlyBill - daytimeUsage / 100) +
            Math.abs(bMonthlyOutput / estimatedUsage - 1);

        // Điểm thấp hơn là phù hợp hơn
        return scoreA - scoreB;
    })[0];
}

// Handle range slider
const daytimeUsageSlider = document.getElementById("daytime-usage");
const daytimeUsageValue = document.getElementById("daytime-usage-value");
const sliderProgress = document.getElementById("slider-progress");

daytimeUsageSlider.addEventListener("input", function () {
    const value = this.value;
    daytimeUsageValue.textContent = value;

    // Update slider progress width to match the selected value
    sliderProgress.style.width = `${value}%`;
});

// Định dạng tiền tệ cho trường nhập tiền điện
const electricityBillInput = document.getElementById("electricity-bill");

// Lưu vị trí con trỏ và giá trị không định dạng
let cursorPosition = 0;
let rawValue = "";

// Xử lý khi người dùng nhập liệu
electricityBillInput.addEventListener("input", function (e) {
    // Lưu vị trí con trỏ
    cursorPosition = this.selectionStart;

    // Lấy giá trị mới nhập vào
    const value = this.value;

    // Loại bỏ tất cả ký tự không phải số
    rawValue = value.replace(/[^\d]/g, "");

    // Nếu không có giá trị, không làm gì cả
    if (!rawValue) {
        this.value = "";
        return;
    }

    // Đếm số ký tự đã bị xóa do định dạng
    const beforeFormat = value.substring(0, cursorPosition);
    const nonDigitsBefore = beforeFormat.replace(/\d/g, "").length;

    // Thêm dấu phẩy ngăn cách hàng nghìn và thêm đơn vị tiền tệ
    const formattedValue = Number(rawValue).toLocaleString("vi-VN") + "đ";
    this.value = formattedValue;

    // Tính toán lại vị trí con trỏ
    const digitsBefore = beforeFormat.replace(/[^\d]/g, "").length;
    let newPosition = 0;
    let countDigits = 0;

    for (let i = 0; i < formattedValue.length; i++) {
        if (formattedValue[i].match(/\d/)) {
            countDigits++;
            if (countDigits > digitsBefore) {
                break;
            }
            newPosition = i;
        }
    }

    // Đặt lại vị trí con trỏ
    if (digitsBefore > 0) {
        this.setSelectionRange(newPosition + 1, newPosition + 1);
    } else {
        this.setSelectionRange(0, 0);
    }
});

// Xử lý khi focus vào ô nhập tiền
electricityBillInput.addEventListener("focus", function () {
    // Chọn toàn bộ nội dung khi focus vào
    this.select();
});

// Xử lý khi blur khỏi ô nhập tiền
electricityBillInput.addEventListener("blur", function () {
    // Nếu không có giá trị, không làm gì cả
    if (!this.value) {
        return;
    }

    // Đảm bảo có định dạng đúng khi rời khỏi ô
    const numericValue = this.value.replace(/[^\d]/g, "");
    if (numericValue) {
        this.value = Number(numericValue).toLocaleString("vi-VN") + "đ";
    }
});

// Thiết lập ban đầu cho thanh trượt
window.addEventListener("DOMContentLoaded", function () {
    // Thiết lập giá trị ban đầu cho slider
    const initialValue = daytimeUsageSlider.value; // Sẽ lấy giá trị 50 từ HTML
    sliderProgress.style.width = `${initialValue}%`;

    // Hiệu ứng loading cho các phần tử khi trang tải xong
    const elementsToAnimate = document.querySelectorAll(".animate-slide-up");
    elementsToAnimate.forEach((el, index) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        setTimeout(() => {
            el.style.transition = "all 0.6s ease";
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        }, 300 + 100 * index);
    });
});

// Input validation
function validateInputs() {
    const monthlyBillText = document.getElementById("electricity-bill").value;
    // Chuyển đổi chuỗi tiền tệ thành số
    const monthlyBill = Number(monthlyBillText.replace(/[^\d]/g, ""));

    if (!monthlyBill) {
        alert("Vui lòng nhập tiền điện trung bình hàng tháng.");
        return false;
    }

    if (monthlyBill < 500000) {
        alert("Tiền điện trung bình hàng tháng phải ít nhất 500,000 VNĐ.");
        return false;
    }

    if (monthlyBill > 50000000) {
        alert(
            "Tiền điện trung bình hàng tháng không được vượt quá 50,000,000 VNĐ."
        );
        return false;
    }

    return true;
}

// Show loading state
function showLoading() {
    const resultsContent = document.getElementById("results-content");
    const resultsPlaceholder = document.getElementById("results-placeholder");

    resultsContent.classList.add("hidden");
    resultsPlaceholder.innerHTML =
        '<p><i class="fas fa-spinner fa-spin text-5xl text-accent block mb-4 animate-spin"></i> Đang tính toán...</p>';
    resultsPlaceholder.classList.remove("hidden");
}

// Hide loading state
function hideLoading() {
    const resultsContent = document.getElementById("results-content");
    const resultsPlaceholder = document.getElementById("results-placeholder");

    resultsPlaceholder.classList.add("hidden");
    resultsContent.classList.remove("hidden");

    // Thêm animation khi hiển thị kết quả
    const resultItems = document.querySelectorAll(".result-card");
    resultItems.forEach((item, index) => {
        item.style.opacity = "0";
        item.style.transform = "translateY(20px)";
        setTimeout(() => {
            item.style.transition = "all 0.5s ease";
            item.style.opacity = "1";
            item.style.transform = "translateY(0)";
        }, 100 * index);
    });
}

// Format number with commas
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Xử lý thông tin về pin lưu trữ
function updateBatteryInfo(recommendedPackage) {
    // Thêm thông tin về pin lưu trữ nếu gói được chọn có pin
    const batteryInfoElement = document.getElementById("battery-info");
    if (recommendedPackage.hasBattery) {
        if (!batteryInfoElement) {
            // Tạo element mới nếu chưa tồn tại
            const batteryInfo = document.createElement("div");
            batteryInfo.id = "battery-info";
            batteryInfo.className =
                "mb-6 p-5 bg-blue-50 rounded-lg shadow-sm border-l-4 border-blue-500";
            batteryInfo.innerHTML = `
                <h3 class="text-primary font-semibold mb-4 text-lg flex items-center">
                    <i class="fas fa-battery-full mr-2 text-blue-500"></i> Thông tin bộ lưu điện:
                </h3>
                <p class="mb-4 text-sm">
                    Hệ thống được trang bị pin lưu trữ ${
                        recommendedPackage.batteryCapacity
                    } kWh, có thể hoạt động như máy phát điện khi mất điện.
                </p>
                <ul class="space-y-2 text-sm list-disc pl-5">
                    <li>
                        Khả năng cung cấp: ${
                            recommendedPackage.batteryCapacity
                        } kW trong vòng 1 giờ
                    </li>
                    <li>
                        Tỷ lệ lưu trữ: ${
                            batteryCoefficient * 100
                        }% năng lượng từ hệ thống điện mặt trời
                    </li>
                    <li>
                        Hoạt động: Tự động sạc bằng năng lượng mặt trời khi có nắng
                    </li>
                </ul>
            `;

            // Chèn vào sau phần công suất hệ thống
            const systemCapacityElement =
                document.querySelector(".mb-6:nth-child(2)");
            systemCapacityElement.parentNode.insertBefore(
                batteryInfo,
                systemCapacityElement.nextSibling
            );
        } else {
            // Cập nhật nếu đã tồn tại
            batteryInfoElement.innerHTML = `
                <h3 class="text-primary font-semibold mb-4 text-lg flex items-center">
                    <i class="fas fa-battery-full mr-2 text-blue-500"></i> Thông tin bộ lưu điện:
                </h3>
                <p class="mb-4 text-sm">
                    Hệ thống được trang bị pin lưu trữ ${
                        recommendedPackage.batteryCapacity
                    } kWh, có thể hoạt động như máy phát điện khi mất điện.
                </p>
                <ul class="space-y-2 text-sm list-disc pl-5">
                    <li>
                        Khả năng cung cấp: ${
                            recommendedPackage.batteryCapacity
                        } kW trong vòng 1 giờ
                    </li>
                    <li>
                        Tỷ lệ lưu trữ: ${
                            batteryCoefficient * 100
                        }% năng lượng từ hệ thống điện mặt trời
                    </li>
                    <li>
                        Hoạt động: Tự động sạc bằng năng lượng mặt trời khi có nắng
                    </li>
                </ul>
            `;
            batteryInfoElement.style.display = "block";
        }
    } else if (batteryInfoElement) {
        // Ẩn thông tin pin nếu gói không có pin
        batteryInfoElement.style.display = "none";
    }
}

// Event listener for form submission
document.getElementById("solar-form").addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate inputs
    if (!validateInputs()) {
        return;
    }

    // Show loading
    showLoading();

    // Simulate calculation delay (for better UX)
    setTimeout(() => {
        // Get user inputs
        const region = document.getElementById("region").value;
        // Chuyển đổi chuỗi tiền tệ thành số
        const monthlyBillText =
            document.getElementById("electricity-bill").value;
        const monthlyBill = parseInt(monthlyBillText.replace(/[^\d]/g, ""));
        const daytimeUsage = parseInt(
            document.getElementById("daytime-usage").value
        );
        const batteryCapacity = parseFloat(
            document.getElementById("battery-capacity").value
        );

        // Find suitable package
        const recommendedPackage = findSuitablePackage(
            monthlyBill,
            daytimeUsage,
            batteryCapacity
        );

        // Calculate results with adaptations for different data structures
        const totalCost =
            recommendedPackage.totalCost || recommendedPackage.cost || 0;
        const systemCapacity =
            recommendedPackage.power || recommendedPackage.capacity || 0;
        const monthlySavings = recommendedPackage.monthlySavings;
        const yearlySavings = recommendedPackage.yearlySavings;
        const thirtyYearSavings = recommendedPackage.thirtyYearSavings;

        // Xử lý thời gian hoàn vốn dựa trên cấu trúc dữ liệu
        let paybackText = "";
        if (recommendedPackage.paybackPeriod) {
            paybackText = `${recommendedPackage.paybackPeriod} năm`;
        } else if (recommendedPackage.paybackYears !== undefined) {
            if (
                recommendedPackage.paybackMonths &&
                recommendedPackage.paybackMonths > 0
            ) {
                paybackText = `${recommendedPackage.paybackYears} năm ${recommendedPackage.paybackMonths} tháng`;
            } else {
                paybackText = `${recommendedPackage.paybackYears} năm`;
            }
        } else {
            paybackText = "N/A";
        }

        // Tính ROI - đảm bảo sử dụng totalCost và yearlySavings
        const roi = (yearlySavings / totalCost) * 100;

        // Display results
        document.getElementById("total-cost").textContent =
            formatCurrency(totalCost);
        document.getElementById(
            "system-capacity"
        ).textContent = `${systemCapacity} kWp`;
        document.getElementById("monthly-savings").textContent =
            formatCurrency(monthlySavings);
        document.getElementById("yearly-savings").textContent =
            formatCurrency(yearlySavings);
        document.getElementById("thirty-year-savings").textContent =
            formatCurrency(thirtyYearSavings);
        document.getElementById("payback-period").textContent = paybackText;
        document.getElementById("roi").textContent = `${roi.toFixed(1)}% / năm`;
        document.getElementById("recommended-product").textContent =
            recommendedPackage.name;

        // Cập nhật thông tin pin lưu trữ
        updateBatteryInfo(recommendedPackage);

        // Hide loading and show results
        hideLoading();

        // Scroll to results
        document
            .getElementById("results")
            .scrollIntoView({ behavior: "smooth" });
    }, 800);
});

// Calculate solar system performance
function calculateSolarSystem() {
    // Lấy thông tin đầu vào từ người dùng
    const monthlyBillText = document.getElementById("electricity-bill").value;
    const monthlyBill = parseInt(monthlyBillText.replace(/[^\d]/g, ""));
    const daytimeUsage = parseInt(
        document.getElementById("daytime-usage").value
    );
    const batteryCapacity = parseFloat(
        document.getElementById("battery-capacity").value
    );

    // Tìm gói phù hợp
    const recommendedPackage = findSuitablePackage(
        monthlyBill,
        daytimeUsage,
        batteryCapacity
    );

    if (!recommendedPackage) {
        alert("Không tìm thấy gói phù hợp cho thông tin của bạn.");
        return;
    }

    // Thích ứng với các cấu trúc dữ liệu khác nhau
    const totalCost =
        recommendedPackage.totalCost || recommendedPackage.cost || 0;
    const systemCapacity =
        recommendedPackage.power || recommendedPackage.capacity || 0;

    // Hiển thị kết quả
    document.getElementById("total-cost").textContent =
        formatCurrency(totalCost);
    document.getElementById(
        "system-capacity"
    ).textContent = `${systemCapacity} kWp`;
    document.getElementById("monthly-savings").textContent = formatCurrency(
        recommendedPackage.monthlySavings
    );
    document.getElementById("yearly-savings").textContent = formatCurrency(
        recommendedPackage.yearlySavings
    );
    document.getElementById("thirty-year-savings").textContent = formatCurrency(
        recommendedPackage.thirtyYearSavings
    );

    // Xử lý thời gian hoàn vốn dựa trên cấu trúc dữ liệu
    let paybackText = "";
    if (recommendedPackage.paybackPeriod) {
        paybackText = `${recommendedPackage.paybackPeriod} năm`;
    } else if (recommendedPackage.paybackYears !== undefined) {
        if (
            recommendedPackage.paybackMonths &&
            recommendedPackage.paybackMonths > 0
        ) {
            paybackText = `${recommendedPackage.paybackYears} năm ${recommendedPackage.paybackMonths} tháng`;
        } else {
            paybackText = `${recommendedPackage.paybackYears} năm`;
        }
    } else {
        paybackText = "N/A";
    }
    document.getElementById("payback-period").textContent = paybackText;

    // Tính ROI - cần đảm bảo có totalCost và yearlySavings
    const roi = (recommendedPackage.yearlySavings / totalCost) * 100;
    document.getElementById("roi").textContent = `${roi.toFixed(1)}% / năm`;

    // Hiển thị tên gói đề xuất
    document.getElementById("recommended-product").textContent =
        recommendedPackage.name;

    // Cập nhật thông tin pin lưu trữ
    updateBatteryInfo(recommendedPackage);

    // Hiển thị kết quả
    document.getElementById("results-placeholder").classList.add("hidden");
    document.getElementById("results-content").classList.remove("hidden");
}

// Request quote function
function requestQuote(packageName) {
    const selectedPackage = currentSolarData.find(
        (pkg) => pkg.name === packageName
    );
    if (!selectedPackage) return;

    let regionText = "";
    if (currentRegion === "north") {
        regionText = "Miền Bắc";
    } else if (currentRegion === "central") {
        regionText = "Miền Trung";
    } else if (currentRegion === "south") {
        regionText = "Miền Nam";
    }

    const message = `Tôi quan tâm đến gói pin mặt trời "${packageName}" cho khu vực ${regionText}. Vui lòng liên hệ với tôi để có báo giá chi tiết.`;

    // Open email client with pre-filled message
    const emailSubject = `Yêu cầu báo giá hệ thống pin mặt trời - ${packageName}`;
    const emailBody = encodeURIComponent(message);
    window.location.href = `mailto:info@solarpower.vn?subject=${encodeURIComponent(
        emailSubject
    )}&body=${emailBody}`;
}
