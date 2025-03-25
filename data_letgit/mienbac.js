// Constants for Northern Region (Miền Bắc) solar calculations
const sunshineHoursCoefficient = 3.5; // Hệ số giờ nắng
const averageElectricityPrice = 3000; // Tiền điện trung bình (VNĐ/kWh)
const batteryStorageCoefficient = 0.6; // Hệ số pin lưu trữ (60%)
const northernRegionCoefficient = 3.5; // TB Miền Bắc (Average coefficient for Northern Region)

// Define variables for the solar system product information
const Column = {
    // STT - Order number
    orderNumber: 1,

    // Loại sản phẩm - Product type
    productType: {
        BAM_TAI: "BÁM TẢI",
        LUU_TRU: "LƯU TRỮ",
    },

    // SẢN PHẨM - Product name
    productName: "",

    // CHI TIẾT CÔNG SUẤT - Power details
    powerDetails: "",

    // CHI TIẾT THIẾT BỊ - Equipment details
    equipmentDetails: "",

    // LƯU TRỮ - Storage (kWh)
    storage: 0,

    // Số KWP - Number of KWP
    kwpNumber: 0,

    // Đơn giá - Unit price
    unitPrice: 0,

    // GIÁ NIÊM YẾT - Listed price
    listedPrice: 0,

    // % Chiết khấu trong tháng - Monthly discount percentage
    monthlyDiscountPercentage: 0,

    // GIÁ LÀM BAO GỒM 10% VAT (VNĐ)(Sau chiết khấu) - Price including 10% VAT after discount
    priceWithVatAfterDiscount: 0,

    // Đơn giá/KW sau chiết khấu - Unit price per KW after discount
    unitPricePerKwAfterDiscount: 0,

    // % Trả trước tối thiểu - Minimum down payment percentage
    minimumDownPaymentPercentage: 0,

    // Tiền trả trước tối thiểu - Minimum down payment amount
    minimumDownPaymentAmount: 0,

    // Số tiền trả góp - Installment amount
    installmentAmount: 0,

    // Số tiền trả góp hàng tháng (Min) - Minimum monthly installment
    minimumMonthlyInstallment: 0,

    // Số tiền trả góp hàng tháng (Max) - Maximum monthly installment
    maximumMonthlyInstallment: 0,

    // Diện tích mái lắp đặt tối thiểu (m2) - Minimum roof installation area
    minimumRoofInstallationArea: 0,

    // Số kWh hệ thống sản xuất trong 30 năm - Total kWh produced in 30 years
    totalKwhProducedIn30Years: 0,

    // Số tiền tiết kiệm được trong 30 năm - Total savings in 30 years
    totalSavingsIn30Years: 0,

    // T/g hoàn vốn (Năm) - Return on investment period (years)
    returnOnInvestmentYears: 0,

    // Số kWh hệ thống sản xuất trung bình 1 tháng (H/s 80%) - Average monthly kWh production (80% efficiency)
    averageMonthlyKwhProduction: 0,

    // Số tiến tiết kiệm trung bình mỗi tháng (H/s 80%) - Average monthly savings (80% efficiency)
    averageMonthlySavings: 0,

    // Số tiền tiết kiệm trong năm đầu tiên - First year savings
    firstYearSavings: 0,

    // Phù hợp với gia đình (Vnđ/tháng,điện mặt trời chiếm 80%) - Suitable for families (VND/month, solar power covers 80%)
    suitableForFamily80Percent: 0,

    // Phù hợp với gia đình (Vnđ/tháng,điện mặt trời chiếm 50%) - Suitable for families (VND/month, solar power covers 50%)
    suitableForFamily50Percent: 0,

    // Phù hợp với gia đình (Vnđ/tháng) - Suitable for families (VND/month)
    suitableForFamilyMonthly: {
        min: 0,
        max: 0,
    },
};

// Tạo một bản ghi mới với giá trị từ Column
function createRecord(data = {}) {
    const record = {
        orderNumber: Column.orderNumber,
        productType: Column.productType,
        productName: Column.productName,
        powerDetails: Column.powerDetails,
        equipmentDetails: Column.equipmentDetails,
        storage: Column.storage,
        kwpNumber: Column.kwpNumber,
        unitPrice: Column.unitPrice,
        listedPrice: Column.listedPrice,
        monthlyDiscountPercentage: Column.monthlyDiscountPercentage,
        priceWithVatAfterDiscount: Column.priceWithVatAfterDiscount,
        unitPricePerKwAfterDiscount: Column.unitPricePerKwAfterDiscount,
        minimumDownPaymentPercentage: Column.minimumDownPaymentPercentage,
        minimumDownPaymentAmount: Column.minimumDownPaymentAmount,
        installmentAmount: Column.installmentAmount,
        minimumMonthlyInstallment: Column.minimumMonthlyInstallment,
        maximumMonthlyInstallment: Column.maximumMonthlyInstallment,
        minimumRoofInstallationArea: Column.minimumRoofInstallationArea,
        totalKwhProducedIn30Years: Column.totalKwhProducedIn30Years,
        totalSavingsIn30Years: Column.totalSavingsIn30Years,
        returnOnInvestmentYears: Column.returnOnInvestmentYears,
        averageMonthlyKwhProduction: Column.averageMonthlyKwhProduction,
        averageMonthlySavings: Column.averageMonthlySavings,
        firstYearSavings: Column.firstYearSavings,
        suitableForFamily80Percent: Column.suitableForFamily80Percent,
        suitableForFamily50Percent: Column.suitableForFamily50Percent,
        suitableForFamilyMonthly: Column.suitableForFamilyMonthly,
        ...data,
    };

    // Công thức
    // Giá niêm yết = Đơn giá * Số KWP
    // (listedPrice = unitPrice * kwpNumber)
    record.listedPrice = record.unitPrice * record.kwpNumber;

    // GIÁ LÀM BAO GỒM 10% VAT = Giá niêm yết * (1 - % Chiết khấu trong tháng)
    // (priceWithVatAfterDiscount = listedPrice * (1 - monthlyDiscountPercentage))
    record.priceWithVatAfterDiscount =
        record.listedPrice * (1 - record.monthlyDiscountPercentage / 100);

    // Đơn giá/KW sau chiết khấu = GIÁ LÀM BAO GỒM 10% VAT / Số KWP
    // (unitPricePerKwAfterDiscount = priceWithVatAfterDiscount / kwpNumber)
    record.unitPricePerKwAfterDiscount =
        record.priceWithVatAfterDiscount / record.kwpNumber;

    // % Trả trước tối thiểu
    // 20% - % Chiết khấu trong tháng
    // (minimumDownPaymentPercentage = 20 - monthlyDiscountPercentage)
    record.minimumDownPaymentPercentage = 20 - record.monthlyDiscountPercentage;

    // Tiền trả trước tối thiểu = Giá niêm yết * % Trả trước tối thiểu
    // (minimumDownPaymentAmount = listedPrice * minimumDownPaymentPercentage)
    record.minimumDownPaymentAmount =
        record.listedPrice * (record.minimumDownPaymentPercentage / 100);

    // Số tiền trả góp = Giá niêm yết * 0.8
    // (installmentAmount = listedPrice * 0.8)
    record.installmentAmount = record.listedPrice * 0.8;

    // Diện tích tối thiểu = 5 * Số KWP
    // (minimumRoofInstallationArea = 5 * kwpNumber)
    record.minimumRoofInstallationArea = 5 * record.kwpNumber;

    // Số tiến tiết kiệm trung bình mỗi tháng ( H/s 80%)
    // Số KWP * 0.8 * 30 * Hệ số giờ nắng * Tiền điện trung bình + Lưu trữ * 30 * Tiền điện trung bình * Hệ số pin lưu trữ
    // averageMonthlySavings = kwpNumber * 0.8 * 30 * sunshineHoursCoefficient * averageElectricityPrice + storage * 30 * averageElectricityPrice * batteryStorageCoefficient
    record.averageMonthlySavings =
        record.kwpNumber *
            0.8 *
            30 *
            sunshineHoursCoefficient *
            averageElectricityPrice +
        record.storage *
            30 *
            averageElectricityPrice *
            batteryStorageCoefficient;

    // Số tiền tiết kiệm trong năm đầu tiên
    // Số tiết kiệm trung bình mỗi tháng * 12
    // firstYearSavings = averageMonthlySavings * 12
    record.firstYearSavings = record.averageMonthlySavings * 12;

    // Số kWh hệ thống sản xuất trung bình 1 tháng  (H/s 80%) = Số tiến tiết kiệm trung bình mỗi tháng ( H/s 80%) / Tiền điện trung bình
    record.averageMonthlyKwhProduction =
        record.averageMonthlySavings / averageElectricityPrice;

    // Số kWh hệ thống sản xuất trong 30 năm = Số kWh hệ thống sản xuất trung bình 1 tháng * 12 * 30
    record.totalKwhProducedIn30Years =
        record.averageMonthlyKwhProduction * 12 * 30;

    // Số tiền tiết kiệm được trong 30 năm = Số kWh hệ thống sản xuất trong 30 năm * Tiền điện trung bình
    record.totalSavingsIn30Years =
        record.totalKwhProducedIn30Years * averageElectricityPrice;

    // T/g hoàn vốn (Năm) = (GIÁ LÀM BAO GỒM 10% VAT / Số tiến tiết kiệm trung bình mỗi tháng) / 12
    record.returnOnInvestmentYears =
        record.priceWithVatAfterDiscount / record.averageMonthlySavings / 12;

    // Phù hợp với gia đình (Vnđ/tháng,điện mặt trời chiếm 80%) = Số tiền tiết kiệm trung bình mỗi tháng / 0.8
    record.suitableForFamily80Percent = record.averageMonthlySavings / 0.8;

    // Phù hợp với gia đình (Vnđ/tháng,điện mặt trời chiếm 50%) = Số tiền tiết kiệm trung bình mỗi tháng / 0.5
    record.suitableForFamily50Percent = record.averageMonthlySavings / 0.5;

    return record;
}

// Công thức
// Giá niêm yết = Đơn giá * Số KWP
// (listedPrice = unitPrice * kwpNumber)

// GIÁ LÀM BAO GỒM 10% VAT = Giá niêm yết * (1 - % Chiết khấu trong tháng)
// (priceWithVatAfterDiscount = listedPrice * (1 - monthlyDiscountPercentage))

// Đơn giá/KW sau chiết khấu = GIÁ LÀM BAO GỒM 10% VAT / Số KWP
// (unitPricePerKwAfterDiscount = priceWithVatAfterDiscount / kwpNumber)

// % Trả trước tối thiểu = 20% - % Chiết khấu trong tháng
// (minimumDownPaymentPercentage = 20 - monthlyDiscountPercentage)

// Tiền trả trước tối thiểu = Giá niêm yết * %Trả trước tối thiểu
// (minimumDownPaymentAmount = listedPrice * minimumDownPaymentPercentage)

// // Số tiền trả góp = Giá niêm yết * 0.8
// (installmentAmount = listedPrice * 0.8)

// Diện tích tối thiểu = 5 * Số KWP
// (minimumRoofInstallationArea = 5 * kwpNumber)

// Số kWh hệ thống sản xuất trung bình 1 tháng  (H/s 80%) = Số tiến tiết kiệm trung bình mỗi tháng ( H/s 80%) / Tiền điện trung bình
// averageMonthlyKwhProduction = averageMonthlySavings / averageElectricityPrice

// Số tiền tiết kiệm trung bình mỗi tháng ( H/s 80%) = Số KWP * 0.8 * 30 * Hệ số giờ nắng * Tiền điện trung bình + Lưu trữ * 30 * Tiền điện trung bình * Hệ số pin lưu trữ
// averageMonthlySavings = kwpNumber * 0.8 * 30 * sunshineHoursCoefficient * averageElectricityPrice + storage * 30 * averageElectricityPrice * batteryStorageCoefficient

// Số tiền tiết kiệm trong năm đầu tiên = Số tiết kiệm trung bình mỗi tháng * 12
// firstYearSavings = averageMonthlySavings * 12

// Số kWh hệ thống sản xuất trong 30 năm = Số kWh hệ thống sản xuất trung bình 1 tháng * 12 * 30
// totalKwhProducedIn30Years = averageMonthlyKwhProduction * 12 * 30

// Số tiền tiết kiệm được trong 30 năm = Số kWh hệ thống sản xuất trong 30 năm * Tiền điện trung bình
// totalSavingsIn30Years = totalKwhProducedIn30Years * averageElectricityPrice

// T/g hoàn vốn (Năm) = (GIÁ LÀM BAO GỒM 10% VAT / Số tiến tiết kiệm trung bình mỗi tháng) / 12
// returnOnInvestmentYears = (priceWithVatAfterDiscount / averageMonthlySavings) / 12

// Phù hợp với gia đình (Vnđ/tháng,điện mặt trời chiếm 80%) = Số tiền tiết kiệm trung bình mỗi tháng / 0.8
// suitableForFamily80Percent = averageMonthlySavings / 0.8

// Phù hợp với gia đình (Vnđ/tháng,điện mặt trời chiếm 50%) = Số tiền tiết kiệm trung bình mỗi tháng / 0.5
// suitableForFamily50Percent = averageMonthlySavings / 0.5

// Sử dụng
const data = [
    // Row 1
    (row1 = createRecord({
        orderNumber: 1,
        productType: Column.productType.BAM_TAI,
        productName: "S6-1P",
        powerDetails: "Hệ bám tải 5,49 kWp 1 pha, không lưu trữ",
        equipmentDetails: "Tấm quang năng JA 610W, biến tần Deye",
        storage: 0.0,
        kwpNumber: 5.49,
        unitPrice: 12000000,
        monthlyDiscountPercentage: 10, // 10%
        minimumMonthlyInstallment: 700000,
        maximumMonthlyInstallment: 1000000,
        suitableForFamilyMonthly: {
            min: 1500000,
            max: 2000000,
        },
    })),

    // // Row 2
    // (row2 = createRecord({})),
    // // Row 3
    // (row3 = createRecord({})),
    // // Row 4
    // (row4 = createRecord({})),
    // // Row 5
    // (row5 = createRecord({})),
    // // Row 6
    // (row6 = createRecord({})),
    // // Row 7
    // (row7 = createRecord({})),
    // // Row 8
    // (row8 = createRecord({})),
    // // Row 9
    // (row9 = createRecord({})),
    // // Row 10
    // (row10 = createRecord({})),
    // // Row 11
    // (row11 = createRecord({})),
    // // Row 12
    // (row12 = createRecord({})),
    // // Row 13
    // (row13 = createRecord({})),
    // // Row 14
    // (row14 = createRecord({})),
    // // Row 15
    // (row15 = createRecord({})),
    // // Row 16
    // (row16 = createRecord({})),
    // // Row 17
    // (row17 = createRecord({})),
    // // Row 18
    // (row18 = createRecord({})),
    // // Row 19
    // (row19 = createRecord({})),
    // // Row 20
    // (row20 = createRecord({})),
    // // Row 21
    // (row21 = createRecord({})),
    // // Row 22
    // (row22 = createRecord({})),
    // // Row 23
    // (row23 = createRecord({})),
    // // Row 24
    // (row24 = createRecord({})),
    // // Row 25
    // (row25 = createRecord({})),
    // // Row 26
    // (row26 = createRecord({})),
];

console.log(`orderNumber: ${row1.orderNumber}`);
console.log(`productType: ${row1.productType}`);
console.log(`productName: ${row1.productName}`);
console.log(`powerDetails: ${row1.powerDetails}`);
console.log(`equipmentDetails: ${row1.equipmentDetails}`);
console.log(`storage: ${row1.storage}`);
console.log(`kwpNumber: ${row1.kwpNumber}`);
console.log(`unitPrice: ${row1.unitPrice}`);
console.log(`listedPrice: ${row1.listedPrice}`);
console.log(`monthlyDiscountPercentage: ${row1.monthlyDiscountPercentage}`);
console.log(`priceWithVatAfterDiscount: ${row1.priceWithVatAfterDiscount}`);
console.log(`unitPricePerKwAfterDiscount: ${row1.unitPricePerKwAfterDiscount}`);
console.log(
    `minimumDownPaymentPercentage: ${row1.minimumDownPaymentPercentage}`
);
console.log(`minimumDownPaymentAmount: ${row1.minimumDownPaymentAmount}`);
console.log(`installmentAmount: ${row1.installmentAmount}`);
console.log(`minimumMonthlyInstallment: ${row1.minimumMonthlyInstallment}`);
console.log(`maximumMonthlyInstallment: ${row1.maximumMonthlyInstallment}`);
console.log(`minimumRoofInstallationArea: ${row1.minimumRoofInstallationArea}`);
console.log(`totalKwhProducedIn30Years: ${row1.totalKwhProducedIn30Years}`);
console.log(`totalSavingsIn30Years: ${row1.totalSavingsIn30Years}`);
console.log(`returnOnInvestmentYears: ${row1.returnOnInvestmentYears}`);
console.log(`averageMonthlyKwhProduction: ${row1.averageMonthlyKwhProduction}`);
console.log(`averageMonthlySavings: ${row1.averageMonthlySavings}`);
console.log(`firstYearSavings: ${row1.firstYearSavings}`);
console.log(`suitableForFamily80Percent: ${row1.suitableForFamily80Percent}`);
console.log(`suitableForFamily50Percent: ${row1.suitableForFamily50Percent}`);
console.log(
    `suitableForFamilyMonthly: ${row1.suitableForFamilyMonthly.min} - ${row1.suitableForFamilyMonthly.max}`
);
