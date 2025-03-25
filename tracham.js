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
    // Show loading indicator
    const button = document.querySelector(
        'button[onclick="calculateInstallmentPayment()"]'
    );
    const loadingIndicator = button.querySelector(".loading-indicator");
    const calculatorIcon = button.querySelector(".fa-calculator");

    // Disable button and show loading state
    button.disabled = true;
    loadingIndicator.classList.remove("hidden");
    calculatorIcon.classList.add("hidden");

    // Get input values
    const contractValue = parseFloat(
        document.getElementById("contractValue").value.replace(/[^\d]/g, "")
    );
    const downPayment = parseFloat(
        document.getElementById("downPayment").value.replace(/[^\d]/g, "")
    );

    // Use default values if elements don't exist
    const interestRateElement = document.getElementById("interestRate");
    const interestRate = interestRateElement
        ? parseFloat(interestRateElement.value) / 100
        : 7.5 / 100; // Default to 7.5% if element doesn't exist

    const termElement = document.getElementById("term");
    const term = termElement ? parseInt(termElement.value) : 60; // Default to 60 months if element doesn't exist

    // Calculate loan amount
    const loanAmount = contractValue - downPayment;

    // Simulate calculation delay for better UX
    setTimeout(() => {
        // Calculate payment schedule for entire loan term
        let paymentSchedule = "";
        let remainingBalance = loanAmount;
        const monthlyPrincipalPayment = loanAmount / term;
        let totalInterest = 0;

        // Generate full payment schedule
        for (let month = 0; month <= term; month++) {
            // For month 0, there's no payment yet
            if (month === 0) {
                paymentSchedule += `
                <tr>
                    <td class="py-2 px-4">${month}</td>
                    <td class="py-2 px-4">${remainingBalance.toLocaleString(
                        "vi-VN"
                    )} đ</td>
                    <td class="py-2 px-4">0</td>
                    <td class="py-2 px-4">0 đ</td>
                    <td class="py-2 px-4">0 đ</td>
                </tr>`;
                continue;
            }

            // Determine interest rate (7.5% for first year, 12% after)
            const currentInterestRate = month <= 12 ? 7.5 / 100 : 12 / 100;
            const monthlyInterestRate = currentInterestRate / 12;

            // Calculate monthly interest
            const interestPayment = remainingBalance * monthlyInterestRate;
            totalInterest += interestPayment;

            // Calculate total monthly payment
            const totalMonthlyPayment =
                monthlyPrincipalPayment + interestPayment;

            // Update remaining balance
            remainingBalance -= monthlyPrincipalPayment;

            // Special styling for certain rows
            let rowClass = "";
            if (month === 12) rowClass = "bg-blue-50"; // End of first year
            if (month === 24) rowClass = "bg-orange-50"; // End of second year

            paymentSchedule += `
            <tr class="${rowClass}">
                <td class="py-2 px-4">${month}</td>
                <td class="py-2 px-4">${Math.max(
                    0,
                    remainingBalance
                ).toLocaleString("vi-VN")} đ</td>
                <td class="py-2 px-4">${monthlyPrincipalPayment.toLocaleString(
                    "vi-VN"
                )} đ</td>
                <td class="py-2 px-4">${interestPayment.toLocaleString(
                    "vi-VN"
                )} đ</td>
                <td class="py-2 px-4">${totalMonthlyPayment.toLocaleString(
                    "vi-VN"
                )} đ</td>
            </tr>`;
        }

        // Add total row
        paymentSchedule += `
        <tr class="bg-gray-100 font-bold">
            <td class="py-2 px-4">Tổng</td>
            <td class="py-2 px-4"></td>
            <td class="py-2 px-4">${loanAmount.toLocaleString("vi-VN")} đ</td>
            <td class="py-2 px-4">${totalInterest.toLocaleString(
                "vi-VN"
            )} đ</td>
            <td class="py-2 px-4">${(loanAmount + totalInterest).toLocaleString(
                "vi-VN"
            )} đ</td>
        </tr>`;

        // Prepare summary HTML for the results section
        const resultSummaryHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-primary/5 p-4 rounded-lg">
                <h4 class="font-semibold text-primary mb-2">Thông tin khoản vay</h4>
                <ul class="space-y-2">
                    <li class="flex justify-between"><span>Giá trị hệ thống:</span> <span class="font-medium">${contractValue.toLocaleString(
                        "vi-VN"
                    )}đ</span></li>
                    <li class="flex justify-between"><span>Số tiền trả trước:</span> <span class="font-medium">${downPayment.toLocaleString(
                        "vi-VN"
                    )}đ</span></li>
                    <li class="flex justify-between"><span>Số tiền vay:</span> <span class="font-medium">${loanAmount.toLocaleString(
                        "vi-VN"
                    )}đ</span></li>
                    <li class="flex justify-between"><span>Lãi suất năm đầu:</span> <span class="font-medium">7,5%</span></li>
                    <li class="flex justify-between"><span>Lãi suất từ năm thứ 2:</span> <span class="font-medium">12%</span></li>
                    <li class="flex justify-between"><span>Kỳ hạn vay:</span> <span class="font-medium">${term} tháng</span></li>
                </ul>
            </div>

            <div class="bg-accent/5 p-4 rounded-lg">
                <h4 class="font-semibold text-accent mb-2">Kết quả tính toán</h4>
                <ul class="space-y-2">
                    <li class="flex justify-between"><span>Tổng tiền gốc phải trả:</span> <span class="font-medium">${loanAmount.toLocaleString(
                        "vi-VN"
                    )}đ</span></li>
                    <li class="flex justify-between"><span>Tổng tiền lãi phải trả:</span> <span class="font-medium">${totalInterest.toLocaleString(
                        "vi-VN"
                    )}đ</span></li>
                    <li class="flex justify-between"><span>Tổng chi phí khoản vay:</span> <span class="font-medium text-accent">${(
                        loanAmount + totalInterest
                    ).toLocaleString("vi-VN")}đ</span></li>
                </ul>
            </div>
        </div>
        
        <div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 class="font-semibold text-blue-600 mb-2 flex items-center">
                <i class="fas fa-lightbulb text-yellow-500 mr-2"></i> Lợi ích khi lắp đặt hệ thống điện mặt trời
            </h4>
            <ul class="space-y-1 text-blue-800">
                <li class="flex items-start">
                    <i class="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                    <span>Tiết kiệm chi phí điện hàng tháng lên đến 70-90%</span>
                </li>
                <li class="flex items-start">
                    <i class="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                    <span>Đầu tư một lần, sử dụng lâu dài (25-30 năm)</span>
                </li>
                <li class="flex items-start">
                    <i class="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                    <span>Khoản tiết kiệm hàng tháng có thể cao hơn khoản trả góp</span>
                </li>
                <li class="flex items-start">
                    <i class="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                    <span>Góp phần bảo vệ môi trường và giảm phát thải carbon</span>
                </li>
            </ul>
        </div>`;

        // Create payment schedule table HTML
        const paymentScheduleHTML = `
        <div class="overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="py-2 px-4 border-b text-left">Tháng</th>
                        <th class="py-2 px-4 border-b text-left">Số tiền gốc còn lại</th>
                        <th class="py-2 px-4 border-b text-left">Số tiền gốc phải trả hàng tháng</th>
                        <th class="py-2 px-4 border-b text-left">Số tiền lãi phải trả hàng tháng (dự kiến)</th>
                        <th class="py-2 px-4 border-b text-left">Tổng tiền gốc và lãi trả hàng tháng</th>
                    </tr>
                </thead>
                <tbody>
                    ${paymentSchedule}
                </tbody>
            </table>
        </div>`;

        // Update the result container
        document.getElementById("result-summary").innerHTML = resultSummaryHTML;

        // Show the payment schedule container and update its content
        const paymentScheduleContainer = document.getElementById(
            "payment-schedule-container"
        );
        paymentScheduleContainer.style.display = "block";
        document.getElementById("payment-schedule").innerHTML =
            paymentScheduleHTML;

        // Show notes container
        document.getElementById("notes-container").style.display = "block";
        document.getElementById("notes").innerHTML = `
        <div class="text-gray-700">
            <h4 class="font-semibold text-primary mb-3">Lưu ý quan trọng:</h4>
            <ul class="space-y-2 text-sm">
                <li class="flex items-start">
                    <i class="fas fa-info-circle text-blue-500 mt-1 mr-2"></i>
                    <span>Lãi suất năm đầu tiên là 7,5%, từ năm thứ 2 trở đi là 12%.</span>
                </li>
                <li class="flex items-start">
                    <i class="fas fa-info-circle text-blue-500 mt-1 mr-2"></i>
                    <span>Bảng trả góp trên là dự tính, có thể thay đổi tùy theo chính sách của ngân hàng tại thời điểm phê duyệt.</span>
                </li>
                <li class="flex items-start">
                    <i class="fas fa-info-circle text-blue-500 mt-1 mr-2"></i>
                    <span>Chi phí trả lãi trước hạn: 2% năm đầu tiên; 1% năm thứ hai; 0% từ năm thứ 3 trở đi.</span>
                </li>
            </ul>
        </div>`;

        // Reset button state
        loadingIndicator.classList.add("hidden");
        calculatorIcon.classList.remove("hidden");
        button.disabled = false;

        // Scroll to payment schedule
        paymentScheduleContainer.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }, 1200); // Simulate a calculation delay of 1.2 seconds
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

// Format currency input - Đổi tên từ formatCurrency để tránh xung đột
function formatCurrencyInput(input) {
    // Remove all non-digit characters
    let value = input.value.replace(/[^\d]/g, "");

    // Format with commas
    if (value.length > 0) {
        value = parseInt(value).toLocaleString("vi-VN");
    }

    input.value = value;
    return value;
}

// Validate monthly income
function validateMonthlyIncome(input) {
    const errorElement = document.getElementById("monthlyIncome-error");
    const checkLimitBtn = document.getElementById("checkLimitBtn");
    const validIcon = document.getElementById("monthly-income-valid");

    // Extract numeric value
    const value = parseInt(input.value.replace(/[^\d]/g, "") || 0);
    const minIncome = 9000000; // 9 million VND

    if (value < minIncome) {
        errorElement.classList.remove("hidden");
        checkLimitBtn.disabled = true;
        checkLimitBtn.classList.add("opacity-50", "cursor-not-allowed");
        validIcon.classList.add("hidden");

        // Add visual indication to the input field
        input.classList.add("border-red-500", "bg-red-50");

        // Update UI to show validation error
        input.classList.remove("border-green-500");
        input.classList.add("border-red-500");

        // Show error tooltip if needed
        errorElement.textContent = `Thu nhập hàng tháng phải từ ${minIncome.toLocaleString(
            "vi-VN"
        )}đ trở lên`;
        errorElement.classList.remove("hidden");

        return false;
    } else {
        errorElement.classList.add("hidden");
        checkLimitBtn.disabled = false;
        checkLimitBtn.classList.remove("opacity-50", "cursor-not-allowed");
        validIcon.classList.remove("hidden");

        // Remove visual indication
        input.classList.remove("border-red-500", "bg-red-50");

        // Update UI to show validation success
        input.classList.remove("border-red-500");
        input.classList.add("border-green-500");

        // Hide error tooltip
        errorElement.classList.add("hidden");

        if (value >= 15000000) {
            input.classList.add("border-green-500", "bg-green-50");
            setTimeout(() => {
                input.classList.remove("border-green-500", "bg-green-50");
            }, 2000);
        }

        return true;
    }
}

// Validate down payment
function validateDownPayment() {
    const contractValueInput = document.getElementById("contractValue");
    const downPaymentInput = document.getElementById("downPayment");
    const errorElement = document.getElementById("downPayment-error");
    const suggestionElement = document.getElementById("downPayment-suggestion");
    const calculateBtn = document.querySelector(
        'button[onclick="calculateInstallmentPayment()"]'
    );
    const validContractIcon = document.getElementById("contract-value-valid");
    const validDownPaymentIcon = document.getElementById("down-payment-valid");

    // Extract contract value
    const contractValue = parseInt(
        contractValueInput.value.replace(/[^\d]/g, "") || 0
    );

    // Extract down payment value
    const downPayment = parseInt(
        downPaymentInput.value.replace(/[^\d]/g, "") || 0
    );

    // Validate contract value first
    if (contractValue >= 10000000) {
        validContractIcon.classList.remove("hidden");
        contractValueInput.classList.remove("border-red-500", "bg-red-50");
        contractValueInput.classList.add("border-green-500");
    } else {
        validContractIcon.classList.add("hidden");
        contractValueInput.classList.remove("border-green-500");
        if (contractValue > 0) {
            contractValueInput.classList.add("border-red-500", "bg-red-50");
        }
    }

    // If contract value is not set yet, don't validate
    if (contractValue === 0) {
        calculateBtn.disabled = true;
        return;
    }

    // Calculate percentage
    const percentage = (downPayment / contractValue) * 100;

    // Update percentage display
    const percentElement = document.getElementById("downPaymentPercent");
    percentElement.textContent = Math.round(percentage) + "%";

    // Update progress bar
    const progressBar = document.getElementById("downPayment-progress");
    // Constrain to 0-100% for display purposes
    const displayPercentage = Math.min(100, Math.max(0, percentage));
    progressBar.style.width = displayPercentage + "%";

    // Validate 40-80% range
    if (percentage < 40 || percentage > 80) {
        errorElement.classList.remove("hidden");
        calculateBtn.disabled = true;
        calculateBtn.classList.add("opacity-50", "cursor-not-allowed");
        downPaymentInput.classList.add("border-red-500", "bg-red-50");
        downPaymentInput.classList.remove("border-green-500");
        validDownPaymentIcon.classList.add("hidden");

        // Show suggestion
        suggestionElement.classList.remove("hidden");

        // Change progress bar color based on range
        if (percentage < 40) {
            progressBar.style.backgroundColor = "#f87171"; // red
            percentElement.classList.add("text-red-500");
            percentElement.classList.remove("text-accent", "bg-accent/10");

            // Calculate min value
            const minValue = Math.ceil(contractValue * 0.4);
            document.getElementById(
                "suggested-amount"
            ).textContent = `Số tiền trả trước tối thiểu là ${minValue.toLocaleString(
                "vi-VN"
            )}đ`;

            // Offer to auto-correct
            document.getElementById(
                "suggested-amount"
            ).innerHTML = `Số tiền trả trước tối thiểu là ${minValue.toLocaleString(
                "vi-VN"
            )}đ 
                <button onclick="applyMinDownPayment()" class="text-blue-500 underline ml-1">
                    Áp dụng giá trị này
                </button>`;
        } else if (percentage > 80) {
            progressBar.style.backgroundColor = "#f87171"; // red
            percentElement.classList.add("text-red-500");
            percentElement.classList.remove("text-accent", "bg-accent/10");

            // Calculate max value
            const maxValue = Math.floor(contractValue * 0.8);
            document.getElementById(
                "suggested-amount"
            ).innerHTML = `Số tiền trả trước tối đa là ${maxValue.toLocaleString(
                "vi-VN"
            )}đ
                <button onclick="applyMaxDownPayment()" class="text-blue-500 underline ml-1">
                    Áp dụng giá trị này
                </button>`;
        }

        return false;
    } else {
        errorElement.classList.add("hidden");
        suggestionElement.classList.add("hidden");

        // Enable calculate button when down payment is valid, without checking monthly income
        calculateBtn.disabled = false;
        calculateBtn.classList.remove("opacity-50", "cursor-not-allowed");

        downPaymentInput.classList.remove("border-red-500", "bg-red-50");
        downPaymentInput.classList.add("border-green-500");
        validDownPaymentIcon.classList.remove("hidden");
        progressBar.style.backgroundColor = ""; // Reset to default
        percentElement.classList.remove("text-red-500");
        percentElement.classList.add("text-accent", "bg-accent/10");

        if (percentage >= 45 && percentage <= 75) {
            downPaymentInput.classList.add("border-green-500", "bg-green-50");
            setTimeout(() => {
                downPaymentInput.classList.remove(
                    "border-green-500",
                    "bg-green-50"
                );
            }, 2000);
        }

        return true;
    }
}

// Function to apply minimum down payment
function applyMinDownPayment() {
    const contractValueInput = document.getElementById("contractValue");
    const downPaymentInput = document.getElementById("downPayment");
    const contractValue = parseInt(
        contractValueInput.value.replace(/[^\d]/g, "") || 0
    );

    if (contractValue > 0) {
        const minValue = Math.ceil(contractValue * 0.4);
        downPaymentInput.value = minValue.toLocaleString("vi-VN");
        validateDownPayment();
    }
}

// Function to apply maximum down payment
function applyMaxDownPayment() {
    const contractValueInput = document.getElementById("contractValue");
    const downPaymentInput = document.getElementById("downPayment");
    const contractValue = parseInt(
        contractValueInput.value.replace(/[^\d]/g, "") || 0
    );

    if (contractValue > 0) {
        const maxValue = Math.floor(contractValue * 0.8);
        downPaymentInput.value = maxValue.toLocaleString("vi-VN");
        validateDownPayment();
    }
}

function closeResults() {
    // Animate the results card out
    const resultsCard = document.getElementById("resultsCard");
    const resultsModal = document.getElementById("calculationResults");

    resultsCard.classList.add("opacity-0", "translate-y-8");

    // Wait for animation to complete before hiding the modal
    setTimeout(() => {
        resultsModal.classList.add("hidden");
    }, 300);
}

// Add event listeners
document.addEventListener("DOMContentLoaded", function () {
    // Update down payment when contract value changes
    if (document.getElementById("contractValue")) {
        document
            .getElementById("contractValue")
            .addEventListener("input", function () {
                const contractValue = parseInt(
                    this.value.replace(/[^\d]/g, "") || 0
                );
                const downPaymentInput = document.getElementById("downPayment");

                // If down payment is empty or invalid, set it to 40% of contract value
                const currentDownPayment = parseInt(
                    downPaymentInput.value.replace(/[^\d]/g, "") || 0
                );
                if (
                    (currentDownPayment === 0 ||
                        this.value.length > downPaymentInput.value.length) &&
                    contractValue > 0
                ) {
                    const defaultDownPayment = Math.round(contractValue * 0.4);
                    downPaymentInput.value =
                        defaultDownPayment.toLocaleString("vi-VN");
                }

                validateDownPayment();
            });
    }

    // Setup improved animations for user interactions
    const setupInputAnimations = () => {
        const inputs = document.querySelectorAll("input");

        inputs.forEach((input) => {
            // Focus animation
            input.addEventListener("focus", () => {
                input.classList.add(
                    "ring-2",
                    "ring-primary/20",
                    "border-primary"
                );
            });

            // Blur animation
            input.addEventListener("blur", () => {
                input.classList.remove(
                    "ring-2",
                    "ring-primary/20",
                    "border-primary"
                );

                // Validate on blur
                if (input.id === "monthlyIncome") {
                    validateMonthlyIncome(input);
                } else if (input.id === "contractValue") {
                    validateDownPayment();
                } else if (input.id === "downPayment") {
                    validateDownPayment();
                }
            });
        });
    };

    // Initialize animations
    setupInputAnimations();

    // Initial validations
    const monthlyIncomeInput = document.getElementById("monthlyIncome");
    const contractValueInput = document.getElementById("contractValue");
    const downPaymentInput = document.getElementById("downPayment");

    // Add placeholder values for better UX
    if (monthlyIncomeInput && !monthlyIncomeInput.value) {
        monthlyIncomeInput.placeholder = "Tối thiểu 9,000,000đ";
    }

    if (contractValueInput && !contractValueInput.value) {
        contractValueInput.placeholder = "Nhập tổng giá trị hệ thống";
    }

    if (downPaymentInput && !downPaymentInput.value) {
        downPaymentInput.placeholder = "Từ 40% đến 80% giá trị hệ thống";
    }

    // Initialize validation on startup
    if (monthlyIncomeInput && monthlyIncomeInput.value) {
        validateMonthlyIncome(monthlyIncomeInput);
    }

    if (
        contractValueInput &&
        downPaymentInput &&
        contractValueInput.value &&
        downPaymentInput.value
    ) {
        validateDownPayment();
    }

    // Disable calculate button initially
    const calculateBtn = document.querySelector(
        'button[onclick="calculateInstallmentPayment()"]'
    );
    if (calculateBtn) {
        calculateBtn.disabled = true;
        calculateBtn.classList.add("opacity-50", "cursor-not-allowed");
    }
});
