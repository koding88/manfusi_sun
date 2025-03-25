// Variables to hold constants and solar data
let northData = {};
let centralData = {};
let southData = {};

// Current region and solar data
let currentRegion = "north";
let currentSolarData = [];
let sunshineCoefficient = 0;
let electricityPrice = 0;
let batteryCoefficient = 0;

// Load all data when document is ready
document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Load region-specific solar data directly from JS modules
        import("./data_letgit/mienbac.js")
            .then((module) => {
                northData = module.default;
                console.log("North data loaded:", northData);

                // Initialize with Northern Vietnam data first
                if (currentRegion === "north") {
                    updateRegionData();
                    updateConstantsDisplay();
                }
            })
            .catch((error) =>
                console.error("Error loading north data:", error)
            );

        import("./data_letgit/mientrung.js")
            .then((module) => {
                centralData = module.default;
                console.log("Central data loaded:", centralData);

                // Update if central region is selected
                if (currentRegion === "central") {
                    updateRegionData();
                    updateConstantsDisplay();
                }
            })
            .catch((error) =>
                console.error("Error loading central data:", error)
            );

        import("./data_letgit/miennam.js")
            .then((module) => {
                southData = module.default;
                console.log("South data loaded:", southData);

                // Update if south region is selected
                if (currentRegion === "south") {
                    updateRegionData();
                    updateConstantsDisplay();
                }
            })
            .catch((error) =>
                console.error("Error loading south data:", error)
            );

        // Setup UI
        const form = document.getElementById("solar-form");
        const regionSelect = document.getElementById("region");

        // Region change handler
        regionSelect.addEventListener("change", function () {
            currentRegion = this.value;
            updateRegionData();
            updateConstantsDisplay();
        });

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

        // Initialize the slider
        const daytimeUsageSlider = document.getElementById("daytime-usage");
        const daytimeUsageValue = document.getElementById(
            "daytime-usage-value"
        );
        const sliderProgress = document.getElementById("slider-progress");

        daytimeUsageSlider.addEventListener("input", function () {
            const value = this.value;
            daytimeUsageValue.textContent = value;

            // Update slider progress width to match the selected value
            sliderProgress.style.width = `${value}%`;
        });
    } catch (error) {
        console.error("Error loading data:", error);
        alert("Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.");
    }
});

// Update data based on selected region
function updateRegionData() {
    if (currentRegion === "north" && northData.sunshineHoursCoefficient) {
        currentSolarData = northData.records || [];
        sunshineCoefficient = northData.sunshineHoursCoefficient;
        electricityPrice = northData.averageElectricityPrice;
        batteryCoefficient = northData.batteryStorageCoefficient;
    } else if (
        currentRegion === "central" &&
        centralData.sunshineHoursCoefficient
    ) {
        currentSolarData = centralData.records || [];
        sunshineCoefficient = centralData.sunshineHoursCoefficient;
        electricityPrice = centralData.averageElectricityPrice;
        batteryCoefficient = centralData.batteryStorageCoefficient;
    } else if (
        currentRegion === "south" &&
        southData.sunshineHoursCoefficient
    ) {
        currentSolarData = southData.records || [];
        sunshineCoefficient = southData.sunshineHoursCoefficient;
        electricityPrice = southData.averageElectricityPrice;
        batteryCoefficient = southData.batteryStorageCoefficient;
    }
}

// Update constants display
function updateConstantsDisplay() {
    const regionName = document.getElementById("region-name");
    const sunshineDisplay = document.getElementById("sunshine-coefficient");
    const electricityDisplay = document.getElementById("electricity-price");
    const batteryDisplay = document.getElementById("battery-coefficient");

    if (currentRegion === "north" && northData.sunshineHoursCoefficient) {
        regionName.textContent = "Miền Bắc";
        sunshineDisplay.textContent = northData.sunshineHoursCoefficient;
        electricityDisplay.textContent =
            northData.averageElectricityPrice.toLocaleString() + " đ";
        batteryDisplay.textContent =
            northData.batteryStorageCoefficient * 100 + "%";
    } else if (
        currentRegion === "central" &&
        centralData.sunshineHoursCoefficient
    ) {
        regionName.textContent = "Miền Trung";
        sunshineDisplay.textContent = centralData.sunshineHoursCoefficient;
        electricityDisplay.textContent =
            centralData.averageElectricityPrice.toLocaleString() + " đ";
        batteryDisplay.textContent =
            centralData.batteryStorageCoefficient * 100 + "%";
    } else if (
        currentRegion === "south" &&
        southData.sunshineHoursCoefficient
    ) {
        regionName.textContent = "Miền Nam";
        sunshineDisplay.textContent = southData.sunshineHoursCoefficient;
        electricityDisplay.textContent =
            southData.averageElectricityPrice.toLocaleString() + " đ";
        batteryDisplay.textContent =
            southData.batteryStorageCoefficient * 100 + "%";
    }
}

// Format currency function
function formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(amount);
}

// Calculate required power based on monthly bill and daytime usage
function calculateRequiredPower(monthlyBill, daytimeUsagePercentage) {
    // Convert percentage to decimal
    const daytimeUsageFraction = daytimeUsagePercentage / 100;

    // Calculate daytime electricity consumption in VND
    const daytimeConsumptionVND = monthlyBill * daytimeUsageFraction;

    // Convert to kWh using the electricity price
    const daytimeConsumptionKWh = daytimeConsumptionVND / electricityPrice;

    // Calculate required power in kWp
    // Daily consumption = monthly consumption / 30 days
    // Required power = daily consumption / sunshine hours coefficient
    const requiredPowerKWp = daytimeConsumptionKWh / sunshineCoefficient / 30;

    console.log("Required power calculation:", {
        monthlyBill,
        daytimeUsagePercentage,
        electricityPrice,
        sunshineCoefficient,
        daytimeConsumptionVND,
        daytimeConsumptionKWh,
        requiredPowerKWp,
    });

    return requiredPowerKWp;
}

// Find the most suitable package based on user inputs
function findSuitablePackage(
    monthlyBill,
    daytimeUsagePercentage,
    batteryCapacity
) {
    if (!currentSolarData || currentSolarData.length === 0) {
        console.error("No solar data available for the current region");
        return null;
    }

    const needsBattery = batteryCapacity > 0;

    // Calculate the required power
    const requiredPowerKWp = calculateRequiredPower(
        monthlyBill,
        daytimeUsagePercentage
    );

    // Filter packages based on battery requirement
    let filteredPackages = currentSolarData.filter((pkg) => {
        return needsBattery ? pkg.storage > 0 : pkg.storage === 0;
    });

    if (needsBattery) {
        // Further filter by specific battery capacity
        filteredPackages = filteredPackages.filter((pkg) => {
            return Math.abs(pkg.storage - batteryCapacity) < 0.01; // Compare with small epsilon for floating point
        });
    }

    // Sort packages by how close they are to the required power
    return filteredPackages.sort((a, b) => {
        const powerDiffA = Math.abs(a.kwpNumber - requiredPowerKWp);
        const powerDiffB = Math.abs(b.kwpNumber - requiredPowerKWp);

        return powerDiffA - powerDiffB;
    })[0]; // Return the closest match
}

// Định dạng tiền tệ cho trường nhập tiền điện
const electricityBillInput = document.getElementById("electricity-bill");

// Xử lý khi người dùng nhập liệu
if (electricityBillInput) {
    // Lưu vị trí con trỏ và giá trị không định dạng
    let cursorPosition = 0;
    let rawValue = "";

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
}

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

    if (resultsContent) resultsContent.classList.add("hidden");
    if (resultsPlaceholder) {
        resultsPlaceholder.innerHTML =
            '<p><i class="fas fa-spinner fa-spin text-5xl text-accent block mb-4 animate-spin"></i> Đang tính toán...</p>';
        resultsPlaceholder.classList.remove("hidden");
    }
}

// Hide loading state
function hideLoading() {
    const resultsContent = document.getElementById("results-content");
    const resultsPlaceholder = document.getElementById("results-placeholder");

    if (resultsPlaceholder) resultsPlaceholder.classList.add("hidden");
    if (resultsContent) {
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
}

// Calculate solar system performance
function calculateSolarSystem() {
    // Lấy thông tin đầu vào từ người dùng
    const monthlyBillText = document.getElementById("electricity-bill").value;
    const monthlyBill = parseInt(monthlyBillText.replace(/[^\d]/g, ""));
    const daytimeUsagePercentage = parseInt(
        document.getElementById("daytime-usage").value
    );
    const batteryCapacity = parseFloat(
        document.getElementById("battery-capacity").value
    );

    // Tính toán công suất cần thiết dựa trên tiền điện và % sử dụng ban ngày
    const requiredPower = calculateRequiredPower(
        monthlyBill,
        daytimeUsagePercentage
    );

    // Tìm gói phù hợp
    const recommendedPackage = findSuitablePackage(
        monthlyBill,
        daytimeUsagePercentage,
        batteryCapacity
    );

    if (!recommendedPackage) {
        alert("Không tìm thấy gói phù hợp cho thông tin của bạn.");
        hideLoading();
        return;
    }

    console.log("Recommended package:", recommendedPackage);

    // Hiển thị kết quả
    document.getElementById("total-cost").textContent = formatCurrency(
        recommendedPackage.priceWithVatAfterDiscount
    );
    document.getElementById(
        "system-capacity"
    ).textContent = `${recommendedPackage.kwpNumber} kWp`;
    document.getElementById("monthly-savings").textContent = formatCurrency(
        recommendedPackage.averageMonthlySavings
    );
    document.getElementById("yearly-savings").textContent = formatCurrency(
        recommendedPackage.averageMonthlySavings * 12
    );
    document.getElementById("thirty-year-savings").textContent = formatCurrency(
        recommendedPackage.totalSavingsIn30Years
    );
    document.getElementById(
        "payback-period"
    ).textContent = `${recommendedPackage.returnOnInvestmentYears.toFixed(
        1
    )} năm`;

    // Tính ROI - lợi nhuận đầu tư hàng năm (%)
    const yearlyROI =
        ((recommendedPackage.averageMonthlySavings * 12) /
            recommendedPackage.priceWithVatAfterDiscount) *
        100;
    document.getElementById("roi").textContent = `${yearlyROI.toFixed(
        1
    )}% / năm`;

    // Hiển thị tên gói đề xuất
    document.getElementById(
        "recommended-product"
    ).textContent = `${recommendedPackage.productName} - ${recommendedPackage.powerDetails}`;

    // Cập nhật thông tin pin lưu trữ nếu có
    updateBatteryInfo(recommendedPackage);

    // Hiển thị kết quả
    document.getElementById("results-placeholder").classList.add("hidden");
    document.getElementById("results-content").classList.remove("hidden");

    // Hiển thị công suất cần thiết theo tính toán
    if (document.getElementById("required-power")) {
        document.getElementById(
            "required-power"
        ).textContent = `${requiredPower.toFixed(2)} kWp`;
    }
}

// Xử lý thông tin về pin lưu trữ
function updateBatteryInfo(recommendedPackage) {
    // Kiểm tra xem gói có bao gồm pin lưu trữ không
    const hasBattery = recommendedPackage.storage > 0;

    // Thêm thông tin về pin lưu trữ nếu gói được chọn có pin
    const batteryInfoElement = document.getElementById("battery-info");
    if (hasBattery) {
        if (!batteryInfoElement) {
            // Tạo element mới nếu chưa tồn tại
            const batteryInfo = document.createElement("div");
            batteryInfo.id = "battery-info";
            batteryInfo.className =
                "mb-6 p-5 bg-blue-50 rounded-lg shadow-sm border-l-4 border-blue-500 result-card";
            batteryInfo.innerHTML = `
                <h3 class="text-primary font-semibold mb-4 text-lg flex items-center">
                    <i class="fas fa-battery-full mr-2 text-blue-500"></i> Thông tin bộ lưu điện:
                </h3>
                <p class="mb-4 text-sm">
                    Hệ thống được trang bị pin lưu trữ ${
                        recommendedPackage.storage
                    } kWh, có thể hoạt động như máy phát điện khi mất điện.
                </p>
                <ul class="space-y-2 text-sm list-disc pl-5">
                    <li>
                        Khả năng cung cấp: ${
                            recommendedPackage.storage
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
            const systemCapacityElement = document.querySelector(
                ".result-card:nth-child(2)"
            );
            if (systemCapacityElement) {
                systemCapacityElement.parentNode.insertBefore(
                    batteryInfo,
                    systemCapacityElement.nextSibling
                );
            }
        } else {
            // Cập nhật nếu đã tồn tại
            batteryInfoElement.innerHTML = `
                <h3 class="text-primary font-semibold mb-4 text-lg flex items-center">
                    <i class="fas fa-battery-full mr-2 text-blue-500"></i> Thông tin bộ lưu điện:
                </h3>
                <p class="mb-4 text-sm">
                    Hệ thống được trang bị pin lưu trữ ${
                        recommendedPackage.storage
                    } kWh, có thể hoạt động như máy phát điện khi mất điện.
                </p>
                <ul class="space-y-2 text-sm list-disc pl-5">
                    <li>
                        Khả năng cung cấp: ${
                            recommendedPackage.storage
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
