// Kiểm tra hạn mức trả chậm

// Yêu cầu:
// 1. Thu nhập hàng tháng

// Hạn mức tối đa: 6 lần thu nhập hàng tháng

// Function to calculate credit limit based on monthly income
const calculateCreditLimit = () => {
    // Input values
    const monthlyIncome = parseFloat(
        document.getElementById("monthlyIncome").value.replace(/[,.đ₫]/g, "")
    );

    // Validate inputs
    if (isNaN(monthlyIncome) || monthlyIncome <= 0) {
        // Create a nice alert
        const creditResultContainer = document.getElementById(
            "credit-result-container"
        );
        creditResultContainer.innerHTML = `
            <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-md shadow animate-fade-in">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <i class="fas fa-exclamation-circle text-red-500 text-xl"></i>
                    </div>
                    <div class="ml-3">
                        <h3 class="text-red-800 font-medium">Vui lòng kiểm tra lại thông tin</h3>
                        <p class="text-red-700 text-sm mt-1">Hãy nhập thu nhập hàng tháng hợp lệ.</p>
                    </div>
                </div>
            </div>
        `;
        // Ẩn các phần khác nếu có lỗi
        document.getElementById("credit-schedule-container").style.display =
            "none";
        return;
    }

    // Calculate maximum credit limit (6 times monthly income)
    const maxCreditLimit = monthlyIncome * 6;

    // Interest rates
    const firstYearInterestRate = 7.5 / 100; // 7.5%
    const secondYearInterestRate = 12 / 100; // 12%

    // Calculate monthly payment details for 60 months
    const term = 60; // Maximum term is 60 months
    const monthlyPrincipalPayment = maxCreditLimit / term;

    // Generate payment schedule
    let monthlyPayments = [];
    let remainingBalance = maxCreditLimit;
    let totalInterest = 0;

    // Add initial state (month 0)
    monthlyPayments.push({
        month: 0,
        remainingBalance,
        principalPayment: 0,
        interestPayment: 0,
        totalPayment: 0,
    });

    // Calculate monthly payments
    for (let month = 1; month <= term; month++) {
        // Determine current interest rate based on month
        const currentInterestRate =
            month <= 12 ? firstYearInterestRate : secondYearInterestRate;

        // Calculate monthly interest (annual rate / 12)
        const monthlyInterest = remainingBalance * (currentInterestRate / 12);

        // Calculate total monthly payment
        const totalMonthlyPayment = monthlyPrincipalPayment + monthlyInterest;

        // Update remaining balance
        remainingBalance -= monthlyPrincipalPayment;

        // Round to avoid floating point issues
        const roundedRemainingBalance = Math.round(remainingBalance);

        // Track total interest
        totalInterest += monthlyInterest;

        // Add payment details to schedule
        monthlyPayments.push({
            month,
            remainingBalance: roundedRemainingBalance,
            principalPayment: monthlyPrincipalPayment,
            interestPayment: monthlyInterest,
            totalPayment: totalMonthlyPayment,
        });
    }

    // Calculate total payments
    const totalPayments = maxCreditLimit + totalInterest;

    // Generate credit approval result
    const creditResultHTML = `
        <div class="opacity-0 transform -translate-y-4 transition-all duration-500" id="creditResultContent">
            <!-- Summary card -->
            <div class="card-gradient rounded-lg shadow-md p-6 border-l-4 border-accent relative overflow-hidden">
                <!-- Thông tin hạn mức header -->
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-secondary flex items-center">
                        <i class="fas fa-check-circle text-success mr-2"></i>
                        Xin chúc mừng, bạn đã được phê duyệt gói trả chậm
                    </h3>
                    <span class="badge badge-success">
                        <i class="fas fa-thumbs-up mr-1"></i> Đã duyệt
                    </span>
                </div>
                
                <!-- Credit limit information -->
                <div class="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div class="font-medium text-gray-600 flex items-center mb-2">
                        <i class="fas fa-credit-card text-primary mr-2"></i>
                        Hạn mức tối đa tạm tính
                    </div>
                    <p class="text-2xl font-bold text-primary">${formatCurrency(
                        maxCreditLimit
                    )}</p>
                    <p class="text-sm text-gray-500 mt-1">Dựa trên thu nhập hàng tháng ${formatCurrency(
                        monthlyIncome
                    )}</p>
                </div>
                
                <!-- Interest rate information -->
                <div class="mt-6 bg-blue-50 p-5 rounded-lg border-l-4 border-primary">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 class="text-primary font-semibold mb-2">Thông tin lãi suất</h4>
                            <div class="flex justify-between text-sm mb-1">
                                <span class="text-gray-600">Lãi suất năm đầu tiên:</span>
                                <span class="font-medium">7,5%</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-600">Lãi suất từ năm thứ 2:</span>
                                <span class="font-medium">12%</span>
                            </div>
                        </div>
                        
                        <div>
                            <h4 class="text-primary font-semibold mb-2">Tổng chi phí</h4>
                            <div class="flex justify-between text-sm mb-1">
                                <span class="text-gray-600">Gốc phải trả:</span>
                                <span class="font-medium">${formatCurrency(
                                    maxCreditLimit
                                )}</span>
                            </div>
                            <div class="flex justify-between text-sm mb-1">
                                <span class="text-gray-600">Tổng tiền lãi:</span>
                                <span class="font-medium">${formatCurrency(
                                    totalInterest
                                )}</span>
                            </div>
                            <div class="flex justify-between text-sm font-bold">
                                <span class="text-gray-800">Tổng chi phí:</span>
                                <span class="text-primary">${formatCurrency(
                                    totalPayments
                                )}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Tips section -->
                <div class="mt-4 text-sm bg-blue-50/50 p-3 rounded-lg">
                    <p class="flex items-start text-gray-600">
                        <i class="fas fa-info-circle text-primary mt-0.5 mr-2"></i>
                        Hạn mức trên chỉ là tạm tính. Hạn mức chính thức sẽ được xác định sau khi hoàn tất thẩm định.
                    </p>
                </div>
            </div>
        </div>
    `;

    // Generate credit payment schedule
    let creditScheduleHTML = `
        <div class="mb-4">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-secondary">
                    <i class="fas fa-calendar-alt text-primary mr-2"></i>
                    Các kỳ thanh toán
                </h3>
                
                <!-- Term filter buttons -->
                <div class="flex space-x-2">
                    <span class="text-sm font-medium mr-1 self-center">Lọc:</span>
                    <button id="credit-all-terms" class="credit-term-filter-btn active-filter">
                        Tất cả
                    </button>
                    <button id="credit-short-terms" class="credit-term-filter-btn">
                        ≤12 tháng
                    </button>
                    <button id="credit-medium-terms" class="credit-term-filter-btn">
                        18-36 tháng
                    </button>
                    <button id="credit-long-terms" class="credit-term-filter-btn">
                        >36 tháng
                    </button>
                </div>
            </div>
            <div class="overflow-x-auto relative">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="table-header">Tháng</th>
                            <th class="table-header">
                                <div class="flex items-center">
                                    <span>Số tiền gốc còn lại</span>
                                    <span class="tooltip ml-1">
                                        <i class="far fa-question-circle text-primary"></i>
                                        <span class="tooltiptext">Số tiền gốc chưa trả tính đến cuối tháng</span>
                                    </span>
                                </div>
                            </th>
                            <th class="table-header">
                                <div class="flex items-center">
                                    <span>Gốc trả hàng tháng</span>
                                    <span class="tooltip ml-1">
                                        <i class="far fa-question-circle text-primary"></i>
                                        <span class="tooltiptext">Tiền gốc phải trả mỗi tháng</span>
                                    </span>
                                </div>
                            </th>
                            <th class="table-header">
                                <div class="flex items-center">
                                    <span>Lãi phải trả hàng tháng</span>
                                    <span class="tooltip ml-1">
                                        <i class="far fa-question-circle text-primary"></i>
                                        <span class="tooltiptext">Tiền lãi phải trả mỗi tháng</span>
                                    </span>
                                </div>
                            </th>
                            <th class="table-header">
                                <div class="flex items-center">
                                    <span>Tổng tiền trả hàng tháng</span>
                                    <span class="tooltip ml-1">
                                        <i class="far fa-question-circle text-primary"></i>
                                        <span class="tooltiptext">Tổng số tiền phải trả mỗi tháng (gốc + lãi)</span>
                                    </span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
    `;

    // Display select months to keep the table manageable
    const displayMonths = [0, 1, 2, 6, 12, 13, 18, 24, 36, 48, 60];

    displayMonths.forEach((monthIndex) => {
        if (monthIndex <= monthlyPayments.length - 1) {
            const payment = monthlyPayments[monthIndex];
            const isFirstYear = payment.month > 0 && payment.month <= 12;
            const isSecondYear = payment.month > 12 && payment.month <= 24;
            const interestRateClass = isFirstYear
                ? "text-blue-600"
                : isSecondYear
                ? "text-orange-600"
                : "";

            // Determine row class for highlighting specific periods
            let rowClass = "";
            if (payment.month === 0) {
                rowClass = "bg-gray-50"; // Initial row
            } else if (payment.month === 12) {
                rowClass = "bg-blue-50"; // End of first year
            } else if (payment.month === 24) {
                rowClass = "bg-orange-50"; // End of second year
            }

            // Determine term type for filtering
            let termType = "";
            if (payment.month <= 12) termType = "short-term";
            else if (payment.month <= 36) termType = "medium-term";
            else termType = "long-term";

            creditScheduleHTML += `
                <tr class="${rowClass} hover:bg-gray-50 transition-colors" data-term-type="${termType}">
                    <td class="table-cell font-medium">
                        ${
                            payment.month === 0
                                ? "0"
                                : `<span class="font-semibold">${payment.month}</span>`
                        }
                    </td>
                    <td class="table-cell font-medium text-gray-900">
                        ${formatCurrency(payment.remainingBalance)}
                    </td>
                    <td class="table-cell font-medium text-gray-900">
                        ${formatCurrency(payment.principalPayment)}
                    </td>
                    <td class="table-cell font-medium ${interestRateClass}">
                        ${formatCurrency(payment.interestPayment)}
                    </td>
                    <td class="table-cell">
                        <span class="font-bold text-primary">${formatCurrency(
                            payment.totalPayment
                        )}</span>
                    </td>
                </tr>
            `;
        }
    });

    // Add totals row
    creditScheduleHTML += `
        <tr class="bg-gray-100 font-bold">
            <td class="table-cell">Tổng</td>
            <td class="table-cell"></td>
            <td class="table-cell text-gray-900">${formatCurrency(
                maxCreditLimit
            )}</td>
            <td class="table-cell text-gray-900">${formatCurrency(
                totalInterest
            )}</td>
            <td class="table-cell text-primary">${formatCurrency(
                totalPayments
            )}</td>
        </tr>
                </tbody>
            </table>
        </div>
    `;

    // Display the results
    document.getElementById("credit-result-container").innerHTML =
        creditResultHTML;
    document.getElementById("credit-schedule").innerHTML = creditScheduleHTML;

    // Hiển thị các phần kết quả
    document.getElementById("credit-schedule-container").style.display =
        "block";

    // Trigger animation after a small delay
    setTimeout(() => {
        const creditResultContent = document.getElementById(
            "creditResultContent"
        );
        if (creditResultContent) {
            creditResultContent.classList.remove("opacity-0", "-translate-y-4");
        }
    }, 50);

    // Add event listeners to term filter buttons
    setupCreditTermFilterButtons();
};

// Function to set up term filter buttons
const setupTermFilterButtons = () => {
    // Get all filter buttons
    const allTermsBtn = document.getElementById("all-terms");
    const shortTermsBtn = document.getElementById("short-terms");
    const mediumTermsBtn = document.getElementById("medium-terms");
    const longTermsBtn = document.getElementById("long-terms");

    // Get all table rows with term data
    const termRows = document.querySelectorAll("tr[data-term-type]");

    // Function to set active filter
    const setActiveFilter = (activeBtn) => {
        // Remove active class from all buttons
        const allButtons = document.querySelectorAll(".term-filter-btn");
        allButtons.forEach((btn) => {
            btn.classList.remove("active-filter");
        });

        // Add active class to the clicked button
        activeBtn.classList.add("active-filter");
    };

    // Function to show all terms
    const showAllTerms = () => {
        termRows.forEach((row) => {
            row.classList.remove("hidden");
        });
        setActiveFilter(allTermsBtn);
    };

    // Add event listeners to filter buttons
    if (allTermsBtn) {
        allTermsBtn.addEventListener("click", showAllTerms);
    }

    if (shortTermsBtn) {
        shortTermsBtn.addEventListener("click", () => {
            // Hide all rows first
            termRows.forEach((row) => {
                row.classList.add("hidden");
            });

            // Show only short-term rows
            document
                .querySelectorAll('tr[data-term-type="short-term"]')
                .forEach((row) => {
                    row.classList.remove("hidden");
                });

            setActiveFilter(shortTermsBtn);
        });
    }

    if (mediumTermsBtn) {
        mediumTermsBtn.addEventListener("click", () => {
            // Hide all rows first
            termRows.forEach((row) => {
                row.classList.add("hidden");
            });

            // Show only medium-term rows
            document
                .querySelectorAll('tr[data-term-type="medium-term"]')
                .forEach((row) => {
                    row.classList.remove("hidden");
                });

            setActiveFilter(mediumTermsBtn);
        });
    }

    if (longTermsBtn) {
        longTermsBtn.addEventListener("click", () => {
            // Hide all rows first
            termRows.forEach((row) => {
                row.classList.add("hidden");
            });

            // Show only long-term rows
            document
                .querySelectorAll('tr[data-term-type="long-term"]')
                .forEach((row) => {
                    row.classList.remove("hidden");
                });

            setActiveFilter(longTermsBtn);
        });
    }

    // Initialize with all terms visible
    showAllTerms();
};

// Function to set up credit term filter buttons
const setupCreditTermFilterButtons = () => {
    // Get all filter buttons
    const allTermsBtn = document.getElementById("credit-all-terms");
    const shortTermsBtn = document.getElementById("credit-short-terms");
    const mediumTermsBtn = document.getElementById("credit-medium-terms");
    const longTermsBtn = document.getElementById("credit-long-terms");

    // Get all table rows with term data
    const termRows = document.querySelectorAll(
        "#credit-schedule tr[data-term-type]"
    );

    // Function to set active filter
    const setActiveFilter = (activeBtn) => {
        // Remove active class from all buttons
        const allButtons = document.querySelectorAll(".credit-term-filter-btn");
        allButtons.forEach((btn) => {
            btn.classList.remove("active-filter");
        });

        // Add active class to the clicked button
        activeBtn.classList.add("active-filter");
    };

    // Function to show all terms
    const showAllTerms = () => {
        termRows.forEach((row) => {
            row.classList.remove("hidden");
        });
        setActiveFilter(allTermsBtn);
    };

    // Add event listeners to filter buttons
    if (allTermsBtn) {
        allTermsBtn.addEventListener("click", showAllTerms);
    }

    if (shortTermsBtn) {
        shortTermsBtn.addEventListener("click", () => {
            // Hide all rows first
            termRows.forEach((row) => {
                row.classList.add("hidden");
            });

            // Show only short-term rows
            document
                .querySelectorAll(
                    '#credit-schedule tr[data-term-type="short-term"]'
                )
                .forEach((row) => {
                    row.classList.remove("hidden");
                });

            setActiveFilter(shortTermsBtn);
        });
    }

    if (mediumTermsBtn) {
        mediumTermsBtn.addEventListener("click", () => {
            // Hide all rows first
            termRows.forEach((row) => {
                row.classList.add("hidden");
            });

            // Show only medium-term rows
            document
                .querySelectorAll(
                    '#credit-schedule tr[data-term-type="medium-term"]'
                )
                .forEach((row) => {
                    row.classList.remove("hidden");
                });

            setActiveFilter(mediumTermsBtn);
        });
    }

    if (longTermsBtn) {
        longTermsBtn.addEventListener("click", () => {
            // Hide all rows first
            termRows.forEach((row) => {
                row.classList.add("hidden");
            });

            // Show only long-term rows
            document
                .querySelectorAll(
                    '#credit-schedule tr[data-term-type="long-term"]'
                )
                .forEach((row) => {
                    row.classList.remove("hidden");
                });

            setActiveFilter(longTermsBtn);
        });
    }

    // Initialize with all terms visible
    showAllTerms();
};

// ================================================================================

// Tính toán lãi gốc hàng tháng

// Yêu cầu:
// 1. Tổng số tiền dự án
// 2. Số tiền muốn trả trước

// Giá trị hợp đồng

// Tổng tiền vay tối đa phải trên 40% và không được vượt quá 80% giá trị hợp đồng (Giá trị hợp đồng * 0.8)

// Thời hạn trả góp (Tháng): Khách hàng có thể vay thấp hơn 60 tháng

// Lãi suất năm đầu tiên (7,5%): 7.5%

// Lãi suất năm dự kiến năm thứ 2 trở đi: 12%

// Chi phí trả lãi trước hạn: (2% năm đầu tiên; 1% năm thứ hai; 0% từ năm thứ 3 trở đi)

// Tháng

// Số tiền gốc còn lại (Tổng tiền vay tối đa 80% giá trị hợp đồng - )

// Số tiền gốc phải trả hàng tháng (Số tiền gốc còn lại / 60 tháng)

// Số tiền lãi phải trả hàng tháng (dự kiến) (Số tiền gốc còn lại * Lãi suất năm đầu tiên / 12)

// Tổng tiền gốc và lãi phải trả hàng tháng (Số tiền gốc phải trả hàng tháng + Số tiền lãi phải trả hàng tháng)

// Function to calculate installment payment
const calculateInstallmentPayment = () => {
    // Input values
    const contractValue = parseFloat(
        document.getElementById("contractValue").value.replace(/[,.đ₫]/g, "")
    );
    const downPayment = parseFloat(
        document.getElementById("downPayment").value.replace(/[,.đ₫]/g, "")
    );

    // Calculate remaining payment (max 80% of contract value)
    const maxLoanPercentage = 80; // 80%
    const maxLoanAmount = (contractValue * maxLoanPercentage) / 100;

    // Validate inputs
    if (isNaN(contractValue) || contractValue <= 0 || isNaN(downPayment)) {
        // Create a nice alert
        const resultSummary = document.getElementById("result-summary");
        if (resultSummary) {
            resultSummary.innerHTML = `
                <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-md shadow animate-fade-in">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <i class="fas fa-exclamation-circle text-red-500 text-xl"></i>
                        </div>
                        <div class="ml-3">
                            <h3 class="text-red-800 font-medium">Vui lòng kiểm tra lại thông tin</h3>
                            <p class="text-red-700 text-sm mt-1">Hãy nhập giá trị hợp đồng và thanh toán trước hợp lệ.</p>
                        </div>
                    </div>
                </div>
            `;
        }
        // Hide other sections if there's an error
        const scheduleContainer = document.getElementById(
            "payment-schedule-container"
        );
        if (scheduleContainer) {
            scheduleContainer.style.display = "none";
        }
        return;
    }

    // Calculate down payment percentage
    const downPaymentPercentage = Math.round(
        (downPayment / contractValue) * 100
    );

    // Check if down payment is sufficient (at least 20% of contract value)
    if (downPaymentPercentage < 20) {
        // Create a nice alert
        const resultSummary = document.getElementById("result-summary");
        if (resultSummary) {
            resultSummary.innerHTML = `
                <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8 rounded-md shadow animate-fade-in">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <i class="fas fa-exclamation-triangle text-yellow-500 text-xl"></i>
                        </div>
                        <div class="ml-3">
                            <h3 class="text-yellow-800 font-medium">Thanh toán trước chưa đủ</h3>
                            <p class="text-yellow-700 text-sm mt-1">Thanh toán trước tối thiểu là 20% giá trị hợp đồng (${formatCurrency(
                                contractValue * 0.2
                            )}).</p>
                        </div>
                    </div>
                </div>
            `;
        }
        // Hide other sections if there's an error
        document.getElementById("payment-schedule-container").style.display =
            "none";
        // Update down payment percentage display
        const percentElement = document.getElementById("downPaymentPercent");
        const progressBar = document.querySelector(".progress-value");

        if (percentElement) {
            percentElement.textContent = downPaymentPercentage + "%";
        }
        if (progressBar) {
            progressBar.style.width = downPaymentPercentage + "%";
            progressBar.classList.remove("bg-success");
            progressBar.classList.add("bg-warning");
        }
        return;
    }

    // Calculate remaining payment (loan amount)
    const remainingPayment = contractValue - downPayment;

    // Check if loan amount exceeds maximum allowed
    if (remainingPayment > maxLoanAmount) {
        // Create a warning alert
        const resultSummary = document.getElementById("result-summary");
        if (resultSummary) {
            resultSummary.innerHTML = `
                <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8 rounded-md shadow animate-fade-in">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <i class="fas fa-exclamation-triangle text-yellow-500 text-xl"></i>
                        </div>
                        <div class="ml-3">
                            <h3 class="text-yellow-800 font-medium">Thanh toán trước chưa đủ</h3>
                            <p class="text-yellow-700 text-sm mt-1">Số tiền vay không được vượt quá ${maxLoanPercentage}% giá trị hợp đồng (${formatCurrency(
                maxLoanAmount
            )}).</p>
                        </div>
                    </div>
                </div>
            `;
        }
        // Hide other sections if there's an error
        document.getElementById("payment-schedule-container").style.display =
            "none";
        // Update down payment percentage display
        const percentElement = document.getElementById("downPaymentPercent");
        const progressBar = document.querySelector(".progress-value");

        if (percentElement) {
            percentElement.textContent = downPaymentPercentage + "%";
        }
        if (progressBar) {
            progressBar.style.width = downPaymentPercentage + "%";
            progressBar.classList.remove("bg-success");
            progressBar.classList.add("bg-warning");
        }
        return;
    }

    // Update down payment percentage display with success color
    const percentElement = document.getElementById("downPaymentPercent");
    const progressBar = document.querySelector(".progress-value");

    if (percentElement) {
        percentElement.textContent = downPaymentPercentage + "%";
    }
    if (progressBar) {
        progressBar.style.width = downPaymentPercentage + "%";
        progressBar.classList.remove("bg-warning");
        progressBar.classList.add("bg-success");
    }

    // Interest rates
    const firstYearInterestRate = 7.5 / 100; // 7.5%
    const secondYearInterestRate = 12 / 100; // 12%

    // Calculate for terms from 6 to 60 months
    const maxTerm = 60; // Maximum term is 60 months

    // Generate payment schedules for all terms
    let allTermPayments = {};

    for (let term = 6; term <= maxTerm; term += 6) {
        const monthlyPrincipalPayment = remainingPayment / term;

        // Generate payment schedule for this term
        let monthlyPayments = [];
        let termRemainingBalance = remainingPayment;
        let termTotalInterest = 0;

        // Add initial state (month 0)
        monthlyPayments.push({
            month: 0,
            remainingBalance: termRemainingBalance,
            principalPayment: 0,
            interestPayment: 0,
            totalPayment: 0,
        });

        // Calculate monthly payments
        for (let month = 1; month <= term; month++) {
            // Determine current interest rate based on month
            const currentInterestRate =
                month <= 12 ? firstYearInterestRate : secondYearInterestRate;

            // Calculate monthly interest (annual rate / 12)
            const monthlyInterest =
                termRemainingBalance * (currentInterestRate / 12);

            // Calculate total monthly payment
            const totalMonthlyPayment =
                monthlyPrincipalPayment + monthlyInterest;

            // Update remaining balance
            termRemainingBalance -= monthlyPrincipalPayment;

            // Round to avoid floating point issues
            const roundedRemainingBalance = Math.round(termRemainingBalance);

            // Track total interest
            termTotalInterest += monthlyInterest;

            // Add payment details to schedule
            monthlyPayments.push({
                month,
                remainingBalance: roundedRemainingBalance,
                principalPayment: monthlyPrincipalPayment,
                interestPayment: monthlyInterest,
                totalPayment: totalMonthlyPayment,
            });
        }

        // Calculate total payments
        const termTotalPayments = remainingPayment + termTotalInterest;

        // Store the payment schedule for this term
        allTermPayments[term] = {
            payments: monthlyPayments,
            totalInterest: termTotalInterest,
            totalPayments: termTotalPayments,
        };
    }

    // Generate HTML for summary results
    const resultHTML = `
        <div id="result" class="opacity-0 transform -translate-y-4 transition-all duration-500">
            <!-- Loan Summary -->
            <div class="card-gradient rounded-lg shadow-md p-6 border-l-4 border-accent relative overflow-hidden mb-6">
                <!-- Summary header -->
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-secondary flex items-center">
                        <i class="fas fa-calculator text-primary mr-2"></i>
                        Thông tin khoản trả góp
                    </h3>
                    <span class="badge badge-primary">
                        <i class="fas fa-info-circle mr-1"></i> Tổng quan
                    </span>
                </div>

                <!-- Loan info -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div class="font-medium text-gray-600 flex items-center mb-1">
                            <i class="fas fa-tag text-primary mr-2"></i>
                            Giá trị hợp đồng
                        </div>
                        <p class="text-xl font-bold text-primary">${formatCurrency(
                            contractValue
                        )}</p>
                    </div>
                    
                    <div class="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div class="font-medium text-gray-600 flex items-center mb-1">
                            <i class="fas fa-money-bill-wave text-success mr-2"></i>
                            Thanh toán trước
                        </div>
                        <p class="text-xl font-bold text-success">${formatCurrency(
                            downPayment
                        )} <span class="text-sm font-normal">(${downPaymentPercentage}%)</span></p>
                    </div>
                    
                    <div class="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div class="font-medium text-gray-600 flex items-center mb-1">
                            <i class="fas fa-wallet text-accent mr-2"></i>
                            Khoản vay
                        </div>
                        <p class="text-xl font-bold text-accent">${formatCurrency(
                            remainingPayment
                        )}</p>
                    </div>
                </div>
                
                <!-- Interest rate information -->
                <div class="mt-6 bg-blue-50 p-4 rounded-lg">
                    <h4 class="text-primary font-medium mb-2">Thông tin lãi suất</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Lãi suất năm đầu tiên:</span>
                            <span class="font-medium">7,5%</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Lãi suất từ năm thứ 2:</span>
                            <span class="font-medium">12%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Generate payment schedule table
    let scheduleHTML = `
        <div class="mb-4">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-secondary">
                    <i class="fas fa-calendar-alt text-primary mr-2"></i>
                    Lịch thanh toán hàng tháng
                </h3>
                
                <!-- Term filter buttons positioned inline with the heading -->
                <div class="flex space-x-2">
                    <span class="text-sm font-medium mr-1 self-center">Lọc:</span>
                    <button id="all-terms" class="term-filter-btn active-filter">
                        Tất cả
                    </button>
                    <button id="short-terms" class="term-filter-btn">
                        ≤12 tháng
                    </button>
                    <button id="medium-terms" class="term-filter-btn">
                        18-36 tháng
                    </button>
                    <button id="long-terms" class="term-filter-btn">
                        >36 tháng
                    </button>
                </div>
            </div>
            <div class="overflow-x-auto relative">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="table-header">Kỳ hạn</th>
                            <th class="table-header">
                                <div class="flex items-center">
                                    <span>Lãi trung bình hàng tháng</span>
                                    <span class="tooltip ml-1">
                                        <i class="far fa-question-circle text-primary"></i>
                                        <span class="tooltiptext">Lãi trung bình phải trả mỗi tháng</span>
                                    </span>
                                </div>
                            </th>
                            <th class="table-header">
                                <div class="flex items-center">
                                    <span>Gốc trả hàng tháng</span>
                                    <span class="tooltip ml-1">
                                        <i class="far fa-question-circle text-primary"></i>
                                        <span class="tooltiptext">Tiền gốc phải trả mỗi tháng</span>
                                    </span>
                                </div>
                            </th>
                            <th class="table-header">
                                <div class="flex items-center">
                                    <span>Trung bình hàng tháng</span>
                                    <span class="tooltip ml-1">
                                        <i class="far fa-question-circle text-primary"></i>
                                        <span class="tooltiptext">Tổng số tiền trung bình phải trả mỗi tháng</span>
                                    </span>
                                </div>
                            </th>
                            <th class="table-header">
                                <div class="flex items-center">
                                    <span>Tổng tiền trả</span>
                                    <span class="tooltip ml-1">
                                        <i class="far fa-question-circle text-primary"></i>
                                        <span class="tooltiptext">Tổng số tiền phải trả trong toàn bộ kỳ hạn</span>
                                    </span>
                                </div>
                            </th>
                            <th class="table-header">
                                <div class="flex items-center">
                                    <span>Chi tiết</span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
    `;

    for (let term = 6; term <= maxTerm; term += 6) {
        const termData = allTermPayments[term];
        const avgMonthlyInterest = termData.totalInterest / term;
        const monthlyPrincipal = remainingPayment / term;
        const avgMonthlyPayment = termData.totalPayments / term;

        // Determine term type for filtering
        let termType = "";
        if (term <= 12) termType = "short-term";
        else if (term <= 36) termType = "medium-term";
        else termType = "long-term";

        // Determine row color
        let rowClass = "";
        if (term === 24) {
            // Highlight 24 months as recommended
            rowClass = "bg-green-50";
        }

        scheduleHTML += `
            <tr class="${rowClass} hover:bg-gray-50 transition-colors" data-term-type="${termType}">
                <td class="table-cell font-medium">
                    ${
                        term === 24
                            ? '<span class="badge badge-recommended mr-2">Đề xuất</span>'
                            : ""
                    }
                    <span class="font-semibold">${term}</span> tháng
                </td>
                <td class="table-cell font-medium text-accent">${formatCurrency(
                    avgMonthlyInterest
                )}</td>
                <td class="table-cell font-medium text-gray-900">${formatCurrency(
                    monthlyPrincipal
                )}</td>
                <td class="table-cell font-medium text-primary">${formatCurrency(
                    avgMonthlyPayment
                )}</td>
                <td class="table-cell">${formatCurrency(
                    termData.totalPayments
                )}</td>
                <td class="table-cell">
                    <button class="view-details-btn bg-blue-50 hover:bg-blue-100 text-blue-700 py-1 px-2 rounded text-xs font-medium transition-colors flex items-center" 
                            data-term="${term}">
                        <i class="fas fa-chart-line mr-1"></i>
                        Chi tiết
                    </button>
                </td>
            </tr>
        `;
    }

    scheduleHTML += `
                    </tbody>
                </table>
            </div>
        </div>
    `;

    // Add the term details modal separately to body, not within the schedule HTML
    let modalHTML = `
        <!-- Term Details Modal with improved positioning -->
        <div id="term-details-modal" class="hidden">
            <div class="modal-overlay fixed inset-0 bg-black bg-opacity-50 z-[9999]"></div>
            <div class="modal-container fixed inset-0 z-[10000] overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4">
                    <div class="bg-white rounded-lg shadow-2xl w-full max-w-4xl transform transition-all">
                        <div class="bg-primary text-white flex justify-between items-center p-4 rounded-t-lg">
                            <h3 class="text-lg font-semibold" id="modal-title">Chi tiết thanh toán</h3>
                            <button id="close-modal" class="text-white hover:text-gray-200">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="p-4 max-h-[70vh] overflow-y-auto" id="modal-content">
                            <!-- Content will be filled by JavaScript -->
                        </div>
                        <div class="border-t p-4 bg-gray-50 flex justify-end rounded-b-lg">
                            <button id="close-modal-btn" class="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors duration-200">
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Update the DOM with the calculated results
    const resultSummary = document.getElementById("result-summary");
    if (resultSummary) {
        resultSummary.innerHTML = resultHTML;
    }
    document.getElementById("payment-schedule").innerHTML = scheduleHTML;

    // Append modal HTML to body if it doesn't exist already
    if (!document.getElementById("term-details-modal")) {
        document.body.insertAdjacentHTML("beforeend", modalHTML);
    }

    // Show the payment schedule container
    document.getElementById("payment-schedule-container").style.display =
        "block";

    // Trigger animation after a small delay
    setTimeout(() => {
        const resultElement = document.getElementById("result");
        if (resultElement) {
            resultElement.classList.remove("opacity-0", "-translate-y-4");
        }
    }, 50);

    // Setup term details modal
    setupTermDetailsModal(allTermPayments, remainingPayment);

    // Setup term filter buttons
    setupTermFilterButtons();
};

// Term details modal functions
function showTermDetails(term, monthlyPayment, totalPayment, rate) {
    // Set values
    document.getElementById("detailsTerm").textContent = term;
    document.getElementById("detailsTerm2").textContent = term;
    document.getElementById("detailsMonthly").textContent =
        formatCurrency(monthlyPayment);
    document.getElementById("detailsMonthly2").textContent =
        formatCurrency(monthlyPayment);
    document.getElementById("detailsTotal").textContent =
        formatCurrency(totalPayment);
    document.getElementById("detailsRate").textContent = rate.toFixed(2) + "%";

    // Show modal
    document.getElementById("termDetailsModal").classList.remove("hidden");
}

function closeTermDetails() {
    document.getElementById("termDetailsModal").classList.add("hidden");
}

// Format currency function
const formatCurrency = (number) => {
    return new Intl.NumberFormat("vi-VN").format(Math.round(number)) + " đ";
};

// Add event listeners and initialize functions
document.addEventListener("DOMContentLoaded", () => {
    // Add CSS for filter buttons
    const style = document.createElement("style");
    style.textContent = `
        .term-filter-btn, .credit-term-filter-btn {
            padding: 0.5rem 0.75rem;
            font-size: 0.75rem;
            font-weight: 500;
            border-radius: 0.375rem;
            transition: all 0.2s;
            background-color: #e5e7eb;
            color: #4b5563;
        }
        
        .term-filter-btn:hover, .credit-term-filter-btn:hover {
            background-color: #d1d5db;
        }
        
        .active-filter {
            background-color: rgba(79, 70, 229, 0.1) !important;
            color: #4f46e5 !important;
        }
        
        /* Ensure modal is above everything */
        #term-details-modal {
            position: fixed;
            z-index: 9999;
        }
    `;
    document.head.appendChild(style);

    // Initialize currency input for contract value and down payment
    setupCurrencyInput("contractValue");
    setupCurrencyInput("downPayment");
    setupCurrencyInput("monthlyIncome");

    // Add event listener to update down payment percentage as user types
    const contractValueInput = document.getElementById("contractValue");
    const downPaymentInput = document.getElementById("downPayment");

    if (contractValueInput && downPaymentInput) {
        // Function to update down payment percentage
        const updateDownPaymentPercentage = () => {
            const contractValue = parseFloat(
                contractValueInput.value.replace(/[,.đ₫]/g, "")
            );
            const downPayment = parseFloat(
                downPaymentInput.value.replace(/[,.đ₫]/g, "")
            );

            if (
                !isNaN(contractValue) &&
                contractValue > 0 &&
                !isNaN(downPayment)
            ) {
                const percentage = Math.round(
                    (downPayment / contractValue) * 100
                );

                // Update the percentage display
                const percentageElement =
                    document.getElementById("downPaymentPercent");
                if (percentageElement) {
                    percentageElement.textContent = percentage + "%";
                }

                // Update the progress bar
                const indicator = document.getElementById(
                    "down-payment-indicator"
                );
                if (indicator) {
                    indicator.style.width = percentage + "%";

                    // Change color based on percentage
                    if (percentage < 20) {
                        indicator.classList.remove("bg-success");
                        indicator.classList.add("bg-warning");
                    } else {
                        indicator.classList.remove("bg-warning");
                        indicator.classList.add("bg-success");
                    }
                }
            }
        };

        // Add event listeners for both inputs
        contractValueInput.addEventListener(
            "input",
            updateDownPaymentPercentage
        );
        downPaymentInput.addEventListener("input", updateDownPaymentPercentage);
    }
});

// Function to setup currency input handling
function setupCurrencyInput(inputId) {
    const inputElement = document.getElementById(inputId);
    if (!inputElement) return;

    // Lưu vị trí con trỏ và giá trị không định dạng
    let cursorPosition = 0;
    let rawValue = "";

    inputElement.addEventListener("input", function (e) {
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

        // Update down payment percentage indicator if this is the down payment field
        if (inputId === "downPayment") {
            updateDownPaymentIndicator();
        }
    });

    // Xử lý khi focus vào ô nhập tiền
    inputElement.addEventListener("focus", function () {
        // Chọn toàn bộ nội dung khi focus vào
        this.select();
    });

    // Xử lý khi blur khỏi ô nhập tiền
    inputElement.addEventListener("blur", function () {
        // Nếu không có giá trị, không làm gì cả
        if (!this.value) {
            return;
        }

        // Đảm bảo có định dạng đúng khi rời khỏi ô
        const numericValue = this.value.replace(/[^\d]/g, "");
        if (numericValue) {
            this.value = Number(numericValue).toLocaleString("vi-VN") + "đ";
        }

        // Update down payment percentage indicator if this is the down payment field
        if (inputId === "downPayment") {
            updateDownPaymentIndicator();
        }
    });
}

// Update down payment percentage indicator
function updateDownPaymentIndicator() {
    const contractValue = parseFloat(
        document.getElementById("contractValue").value.replace(/[,.đ₫]/g, "")
    );
    const downPayment = parseFloat(
        document.getElementById("downPayment").value.replace(/[,.đ₫]/g, "")
    );

    if (!isNaN(contractValue) && !isNaN(downPayment) && contractValue > 0) {
        const percentage = Math.round((downPayment / contractValue) * 100);
        const downPaymentPercent =
            document.getElementById("downPaymentPercent");
        const progressValue = document.querySelector(".progress-value");

        if (downPaymentPercent && progressValue) {
            // Ensure percentage is at least 20% (minimum) and at most 100%
            const displayPercentage = Math.max(20, Math.min(100, percentage));
            downPaymentPercent.textContent = displayPercentage + "%";
            progressValue.style.width = displayPercentage + "%";

            // Change color based on percentage
            if (displayPercentage < 20) {
                progressValue.style.backgroundColor = "#ef4444"; // Red for less than minimum
            } else if (displayPercentage < 50) {
                progressValue.style.backgroundColor = "#f59e0b"; // Amber for less than 50%
            } else {
                progressValue.style.backgroundColor = ""; // Default green gradient for 50%+
            }
        }
    }
}

// Function to handle term details modal
const setupTermDetailsModal = (allTermPayments, totalLoanAmount) => {
    const modal = document.getElementById("term-details-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalContent = document.getElementById("modal-content");
    const closeModal = document.getElementById("close-modal");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const modalOverlay = modal.querySelector(".modal-overlay");

    // Function to open modal
    const openModal = () => {
        modal.classList.remove("hidden");
        document.body.style.overflow = "hidden"; // Prevent scrolling
    };

    // Function to close modal
    const closeModalFunc = () => {
        modal.classList.add("hidden");
        document.body.style.overflow = ""; // Re-enable scrolling
    };

    // Add event listeners to view details buttons
    const viewDetailsButtons = document.querySelectorAll(".view-details-btn");
    viewDetailsButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const term = parseInt(button.getAttribute("data-term"));
            const termData = allTermPayments[term];

            if (!termData) return;

            // Set modal title
            modalTitle.textContent = `Chi tiết thanh toán cho kỳ hạn ${term} tháng`;

            // Generate modal content
            let contentHTML = `
                <div class="mb-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <div class="text-gray-700 font-medium mb-1">Khoản vay</div>
                            <div class="text-xl font-bold text-primary">${formatCurrency(
                                totalLoanAmount
                            )}</div>
                        </div>
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <div class="text-gray-700 font-medium mb-1">Tổng tiền lãi</div>
                            <div class="text-xl font-bold text-accent">${formatCurrency(
                                termData.totalInterest
                            )}</div>
                        </div>
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <div class="text-gray-700 font-medium mb-1">Tổng chi phí</div>
                            <div class="text-xl font-bold text-secondary">${formatCurrency(
                                termData.totalPayments
                            )}</div>
                        </div>
                    </div>
                
                    <!-- Detailed explanation -->
                    <div class="bg-gray-50 p-4 rounded-lg mb-6">
                        <h4 class="font-medium text-gray-800 mb-2">Thông tin khoản vay</h4>
                        <div class="space-y-1 text-sm">
                            <p>• Kỳ hạn vay: <span class="font-medium">${term} tháng</span></p>
                            <p>• Lãi suất năm đầu: <span class="font-medium text-blue-600">7,5%</span></p>
                            <p>• Lãi suất từ năm thứ 2: <span class="font-medium text-orange-600">12%</span></p>
                            <p>• Gốc trả hàng tháng: <span class="font-medium">${formatCurrency(
                                totalLoanAmount / term
                            )}</span></p>
                        </div>
                    </div>
                </div>
                
                <!-- Payment schedule table -->
                <div class="overflow-x-auto">
                    <h4 class="font-medium text-gray-800 mb-3">Chi tiết thanh toán hàng tháng</h4>
                    <table class="w-full">
                        <thead class="bg-gray-100">
                            <tr>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Tháng</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Số dư gốc</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Gốc trả</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Lãi trả</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Tổng tiền trả</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
            `;

            // Show specific months to keep the table manageable
            const payments = termData.payments;
            const displayMonths = [0, 1, 2, 3, 6, 12];

            // Add additional months if term is longer
            if (term > 12) {
                displayMonths.push(13);
                displayMonths.push(Math.min(24, term));
            }

            if (term > 24) {
                displayMonths.push(25);
                displayMonths.push(Math.min(36, term));
            }

            if (term > 36) {
                displayMonths.push(term);
            }

            // Make sure we include the last month if not already included
            if (!displayMonths.includes(term) && term > 0) {
                displayMonths.push(term);
            }

            // Sort months and remove duplicates
            const uniqueMonths = [...new Set(displayMonths)].sort(
                (a, b) => a - b
            );

            uniqueMonths.forEach((monthIndex) => {
                if (monthIndex <= payments.length - 1) {
                    const payment = payments[monthIndex];
                    const isFirstYear =
                        payment.month > 0 && payment.month <= 12;
                    const isSecondYear = payment.month > 12;

                    // Determine row class for highlighting
                    let rowClass = "";
                    if (payment.month === 0) {
                        rowClass = "bg-gray-50"; // Initial row
                    } else if (payment.month === 12) {
                        rowClass = "bg-blue-50"; // End of first year
                    } else if (payment.month === 24) {
                        rowClass = "bg-orange-50"; // End of second year
                    }

                    // Determine interest rate class
                    const interestRateClass = isFirstYear
                        ? "text-blue-600"
                        : isSecondYear
                        ? "text-orange-600"
                        : "";

                    contentHTML += `
                        <tr class="${rowClass}">
                            <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                ${
                                    payment.month === 0
                                        ? "Ban đầu"
                                        : payment.month
                                }
                            </td>
                            <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                                ${formatCurrency(payment.remainingBalance)}
                            </td>
                            <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                                ${formatCurrency(payment.principalPayment)}
                            </td>
                            <td class="px-4 py-2 whitespace-nowrap text-sm ${interestRateClass}">
                                ${formatCurrency(payment.interestPayment)}
                            </td>
                            <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-primary">
                                ${formatCurrency(payment.totalPayment)}
                            </td>
                        </tr>
                    `;
                }
            });

            // Add a totals row
            contentHTML += `
                        <tr class="bg-gray-100 font-medium">
                            <td class="px-4 py-2 whitespace-nowrap text-sm">Tổng</td>
                            <td class="px-4 py-2 whitespace-nowrap text-sm"></td>
                            <td class="px-4 py-2 whitespace-nowrap text-sm">${formatCurrency(
                                totalLoanAmount
                            )}</td>
                            <td class="px-4 py-2 whitespace-nowrap text-sm">${formatCurrency(
                                termData.totalInterest
                            )}</td>
                            <td class="px-4 py-2 whitespace-nowrap text-sm text-primary">${formatCurrency(
                                termData.totalPayments
                            )}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            `;

            // Set modal content
            modalContent.innerHTML = contentHTML;

            // Show modal
            openModal();
        });
    });

    // Close modal when clicking the close button
    if (closeModal) {
        closeModal.addEventListener("click", closeModalFunc);
    }

    // Close modal when clicking the close button at the bottom
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeModalFunc);
    }

    // Close modal when clicking outside the modal content
    if (modalOverlay) {
        modalOverlay.addEventListener("click", closeModalFunc);
    }

    // Close modal with ESC key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !modal.classList.contains("hidden")) {
            closeModalFunc();
        }
    });
};
