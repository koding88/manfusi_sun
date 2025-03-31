// Constants for Southern Region (Miền Nam) solar calculations
const SouthSunshineHoursCoefficient = 4.5; // Hệ số giờ nắng
const SouthAverageElectricityPrice = 3000; // Tiền điện trung bình (VNĐ/kWh)
const SouthBatteryStorageCoefficient = 0.6; // Hệ số pin lưu trữ (60%)
const SouthernRegionCoefficient = 4.5; // TB Miền Nam (Average coefficient for Southern Region)

// Define variables for the solar system product information
const SouthColumn = {
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

// Tạo một bản ghi mới với giá trị từ SouthColumn
function createRecord(data = {}) {
    const record = {
        orderNumber: SouthColumn.orderNumber,
        productType: SouthColumn.productType,
        productName: SouthColumn.productName,
        powerDetails: SouthColumn.powerDetails,
        equipmentDetails: SouthColumn.equipmentDetails,
        storage: SouthColumn.storage,
        kwpNumber: SouthColumn.kwpNumber,
        unitPrice: SouthColumn.unitPrice,
        listedPrice: SouthColumn.listedPrice,
        monthlyDiscountPercentage: SouthColumn.monthlyDiscountPercentage,
        priceWithVatAfterDiscount: SouthColumn.priceWithVatAfterDiscount,
        unitPricePerKwAfterDiscount: SouthColumn.unitPricePerKwAfterDiscount,
        minimumDownPaymentPercentage: SouthColumn.minimumDownPaymentPercentage,
        minimumDownPaymentAmount: SouthColumn.minimumDownPaymentAmount,
        installmentAmount: SouthColumn.installmentAmount,
        minimumMonthlyInstallment: SouthColumn.minimumMonthlyInstallment,
        maximumMonthlyInstallment: SouthColumn.maximumMonthlyInstallment,
        minimumRoofInstallationArea: SouthColumn.minimumRoofInstallationArea,
        totalKwhProducedIn30Years: SouthColumn.totalKwhProducedIn30Years,
        totalSavingsIn30Years: SouthColumn.totalSavingsIn30Years,
        returnOnInvestmentYears: SouthColumn.returnOnInvestmentYears,
        averageMonthlyKwhProduction: SouthColumn.averageMonthlyKwhProduction,
        averageMonthlySavings: SouthColumn.averageMonthlySavings,
        firstYearSavings: SouthColumn.firstYearSavings,
        suitableForFamily80Percent: SouthColumn.suitableForFamily80Percent,
        suitableForFamily50Percent: SouthColumn.suitableForFamily50Percent,
        suitableForFamilyMonthly: SouthColumn.suitableForFamilyMonthly,
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
    // averageMonthlySavings = kwpNumber * 0.8 * 30 * SouthSunshineHoursCoefficient * SouthAverageElectricityPrice + storage * 30 * SouthAverageElectricityPrice * SouthBatteryStorageCoefficient
    record.averageMonthlySavings =
        record.kwpNumber *
            0.8 *
            30 *
            SouthSunshineHoursCoefficient *
            SouthAverageElectricityPrice +
        record.storage *
            30 *
            SouthAverageElectricityPrice *
            SouthBatteryStorageCoefficient;

    // Số tiền tiết kiệm trong năm đầu tiên
    // Số tiết kiệm trung bình mỗi tháng * 12
    // firstYearSavings = averageMonthlySavings * 12
    record.firstYearSavings = record.averageMonthlySavings * 12;

    // Số kWh hệ thống sản xuất trung bình 1 tháng  (H/s 80%) = Số tiến tiết kiệm trung bình mỗi tháng ( H/s 80%) / Tiền điện trung bình
    record.averageMonthlyKwhProduction =
        record.averageMonthlySavings / SouthAverageElectricityPrice;

    // Số kWh hệ thống sản xuất trong 30 năm = Số kWh hệ thống sản xuất trung bình 1 tháng * 12 * 30
    record.totalKwhProducedIn30Years =
        record.averageMonthlyKwhProduction * 12 * 30;

    // Số tiền tiết kiệm được trong 30 năm = Số kWh hệ thống sản xuất trong 30 năm * Tiền điện trung bình
    record.totalSavingsIn30Years =
        record.totalKwhProducedIn30Years * SouthAverageElectricityPrice;

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
// averageMonthlyKwhProduction = averageMonthlySavings / SouthAverageElectricityPrice

// Số tiền tiết kiệm trung bình mỗi tháng ( H/s 80%) = Số KWP * 0.8 * 30 * Hệ số giờ nắng * Tiền điện trung bình + Lưu trữ * 30 * Tiền điện trung bình * Hệ số pin lưu trữ
// averageMonthlySavings = kwpNumber * 0.8 * 30 * SouthSunshineHoursCoefficient * SouthAverageElectricityPrice + storage * 30 * SouthAverageElectricityPrice * SouthBatteryStorageCoefficient

// Số tiền tiết kiệm trong năm đầu tiên = Số tiết kiệm trung bình mỗi tháng * 12
// firstYearSavings = averageMonthlySavings * 12

// Số kWh hệ thống sản xuất trong 30 năm = Số kWh hệ thống sản xuất trung bình 1 tháng * 12 * 30
// totalKwhProducedIn30Years = averageMonthlyKwhProduction * 12 * 30

// Số tiền tiết kiệm được trong 30 năm = Số kWh hệ thống sản xuất trong 30 năm * Tiền điện trung bình
// totalSavingsIn30Years = totalKwhProducedIn30Years * SouthAverageElectricityPrice

// T/g hoàn vốn (Năm) = (GIÁ LÀM BAO GỒM 10% VAT / Số tiến tiết kiệm trung bình mỗi tháng) / 12
// returnOnInvestmentYears = (priceWithVatAfterDiscount / averageMonthlySavings) / 12

// Phù hợp với gia đình (Vnđ/tháng,điện mặt trời chiếm 80%) = Số tiền tiết kiệm trung bình mỗi tháng / 0.8
// suitableForFamily80Percent = averageMonthlySavings / 0.8

// Phù hợp với gia đình (Vnđ/tháng,điện mặt trời chiếm 50%) = Số tiền tiết kiệm trung bình mỗi tháng / 0.5
// suitableForFamily50Percent = averageMonthlySavings / 0.5

// Sử dụng
const SouthRecords = [
    // Row 1
    createRecord({
        orderNumber: 1,
        productType: SouthColumn.productType.BAM_TAI,
        productName: "S6-1P",
        powerDetails: "Hệ bám tải 5,49 kWp 1 pha, không lưu trữ",
        equipmentDetails: "Tấm quang năng JA 610W, biến tần Deye",
        storage: 0.0,
        kwpNumber: 5.49,
        unitPrice: 12000000,
        monthlyDiscountPercentage: 15, // 15%
        minimumMonthlyInstallment: 700000,
        maximumMonthlyInstallment: 1000000,
        suitableForFamilyMonthly: {
            min: 1900000,
            max: 3100000,
        },
    }),
    // // Row 2
    createRecord({
        orderNumber: 2,
        productType: SouthColumn.productType.BAM_TAI,
        productName: "S8-1P",
        powerDetails: "Hệ bám tải 8,54 kWp 1 pha, không lưu trữ",
        equipmentDetails: "Tấm quang năng JA 610W, biến tần Deye",
        storage: 0.0,
        kwpNumber: 8.54,
        unitPrice: 12000000,
        monthlyDiscountPercentage: 15, // 15%
        minimumMonthlyInstallment: 1200000,
        maximumMonthlyInstallment: 1400000,
        suitableForFamilyMonthly: {
            min: 3000000,
            max: 5000000,
        },
    }),
    // // Row 3
    createRecord({
        orderNumber: 3,
        productType: SouthColumn.productType.BAM_TAI,
        productName: "S11-1P",
        powerDetails: "Hệ bám tải 10,98 kWp 1 pha, không lưu trữ",
        equipmentDetails: "Tấm quang năng JA 610W, biến tần Deye",
        storage: 0.0,
        kwpNumber: 10.98,
        unitPrice: 11000000,
        monthlyDiscountPercentage: 15, // 15%
        minimumDownPaymentPercentage: 5, // 5%
        minimumMonthlyInstallment: 1200000,
        maximumMonthlyInstallment: 2000000,
        minimumRoofInstallationArea: 55,
        returnOnInvestmentYears: 2.4,
        averageMonthlyKwhProduction: 1185.84,
        suitableForFamilyMonthly: {
            min: 4000000,
            max: 6000000,
        },
    }),
    // // Row 4
    createRecord({
        orderNumber: 4,
        productType: SouthColumn.productType.BAM_TAI,
        productName: "S11-3P",
        powerDetails: "Hệ bám tải 10,98 kWp 3 pha, không lưu trữ",
        equipmentDetails: "Tấm quang năng JA 610W, biến tần Deye",
        storage: 0.0,
        kwpNumber: 10.98,
        unitPrice: 11000000,
        monthlyDiscountPercentage: 15, // 15%
        minimumDownPaymentPercentage: 5, // 5%
        minimumMonthlyInstallment: 1200000,
        maximumMonthlyInstallment: 2000000,
        minimumRoofInstallationArea: 55,
        returnOnInvestmentYears: 2.4,
        averageMonthlyKwhProduction: 1185.84,
        suitableForFamilyMonthly: {
            min: 4000000,
            max: 6000000,
        },
    }),
    // // Row 5
    createRecord({
        orderNumber: 5,
        productType: SouthColumn.productType.BAM_TAI,
        productName: "S17-3P",
        powerDetails: "Hệ bám tải 17,08 kWp 3 pha, không lưu trữ",
        equipmentDetails: "Tấm quang năng JA 610W, biến tần Deye",
        storage: 0.0,
        kwpNumber: 17.08,
        unitPrice: 11000000,
        monthlyDiscountPercentage: 15, // 15%
        minimumDownPaymentPercentage: 5, // 5%
        minimumMonthlyInstallment: 2200000,
        maximumMonthlyInstallment: 3200000,
        minimumRoofInstallationArea: 83,
        returnOnInvestmentYears: 2.4,
        averageMonthlyKwhProduction: 1844.64,
        suitableForFamilyMonthly: {
            min: 6000000,
            max: 9000000,
        },
    }),
    // // Row 6
    createRecord({
        orderNumber: 6,
        productType: SouthColumn.productType.BAM_TAI,
        productName: "S22-3P",
        powerDetails: "Hệ bám tải 21,96 kWp 3 pha, không lưu trữ",
        equipmentDetails: "Tấm quang năng JA 610W, biến tần Deye",
        storage: 0.0,
        kwpNumber: 21.96,
        unitPrice: 10000000,
        monthlyDiscountPercentage: 15, // 15%
        minimumDownPaymentPercentage: 5, // 5%
        minimumMonthlyInstallment: 2500000,
        maximumMonthlyInstallment: 3600000,
        minimumRoofInstallationArea: 100,
        returnOnInvestmentYears: 2.19,
        averageMonthlyKwhProduction: 2371.68,
        suitableForFamilyMonthly: {
            min: 8000000,
            max: 12000000,
        },
    }),
    // // Row 7
    createRecord({
        orderNumber: 7,
        productType: SouthColumn.productType.BAM_TAI,
        productName: "S34-3P",
        powerDetails: "Hệ bám tải 34,16 kWp 3 pha, không lưu trữ",
        equipmentDetails: "Tấm quang năng JA 610W, biến tần Deye",
        storage: 0.0,
        kwpNumber: 34.16,
        unitPrice: 10000000,
        monthlyDiscountPercentage: 15, // 15%
        minimumDownPaymentPercentage: 5, // 5%
        minimumMonthlyInstallment: 3900000,
        maximumMonthlyInstallment: 5700000,
        minimumRoofInstallationArea: 150,
        returnOnInvestmentYears: 2.19,
        averageMonthlyKwhProduction: 3689.28,
        suitableForFamilyMonthly: {
            min: 12000000,
            max: 19000000,
        },
    }),
    // // Row 8
    createRecord({
        orderNumber: 8,
        productType: SouthColumn.productType.BAM_TAI,
        productName: "S55-3P",
        powerDetails: "Hệ bám tải 54,9 kWp 3 pha, không lưu trữ",
        equipmentDetails: "Tấm quang năng JA 610W, biến tần Deye",
        storage: 0.0,
        kwpNumber: 54.9,
        unitPrice: 10000000,
        monthlyDiscountPercentage: 15, // 15%
        minimumDownPaymentPercentage: 5, // 5%
        minimumMonthlyInstallment: 6200000,
        maximumMonthlyInstallment: 9200000,
        minimumRoofInstallationArea: 265,
        returnOnInvestmentYears: 2.19,
        averageMonthlyKwhProduction: 5929.2,
        suitableForFamilyMonthly: {
            min: 19000000,
            max: 31000000,
        },
    }),
    // // Row 9
    createRecord({
        orderNumber: 9,
        productType: SouthColumn.productType.BAM_TAI,
        productName: "S92-3P",
        powerDetails: "Hệ bám tải 91,5 kWp 3 pha, không lưu trữ",
        equipmentDetails: "Tấm quang năng JA 610W, biến tần Growatt",
        storage: 0.0,
        kwpNumber: 91.5,
        unitPrice: 10000000,
        monthlyDiscountPercentage: 15, // 15%
        minimumDownPaymentPercentage: 5, // 5%
        minimumMonthlyInstallment: 10400000,
        maximumMonthlyInstallment: 15000000,
        minimumRoofInstallationArea: 25,
        returnOnInvestmentYears: 2.19,
        averageMonthlyKwhProduction: 9882.0,
        suitableForFamilyMonthly: {
            min: 32000000,
            max: 52000000,
        },
    }),
    // // Row 10
    createRecord({
        orderNumber: 10,
        productType: SouthColumn.productType.BAM_TAI,
        productName: "S120-3P",
        powerDetails: "Hệ bám tải 118,95 kWp 3 pha, không lưu trữ",
        equipmentDetails: "Tấm quang năng JA 610W, biến tần Growatt",
        storage: 0.0,
        kwpNumber: 118.95,
        unitPrice: 9350000,
        monthlyDiscountPercentage: 15, // 15%
        minimumDownPaymentPercentage: 5, // 5%
        minimumMonthlyInstallment: 12700000,
        maximumMonthlyInstallment: 18600000,
        minimumRoofInstallationArea: 40,
        returnOnInvestmentYears: 2.04,
        averageMonthlyKwhProduction: 12846.6,
        suitableForFamilyMonthly: {
            min: 42000000,
            max: 68000000,
        },
    }),
    // // Row 11
    createRecord({
        orderNumber: 11,
        productType: SouthColumn.productType.LUU_TRU,
        productName: "SHB5-1P",
        powerDetails: "Hệ bám tải, lưu trữ 5,49kWp 1 pha, pin lưu trữ 5,12 kWh",
        equipmentDetails:
            "Tấm quang năng JA 610W, biến tần Deye, pin lưu trữ Liman",
        storage: 5.12,
        kwpNumber: 5.49,
        unitPrice: 20000000,
        monthlyDiscountPercentage: 10, // 10%
        minimumDownPaymentPercentage: 10, // 10%
        minimumMonthlyInstallment: 1300000,
        maximumMonthlyInstallment: 1900000,
        minimumRoofInstallationArea: 55,
        returnOnInvestmentYears: 4.01,
        averageMonthlyKwhProduction: 685.08,
        suitableForFamilyMonthly: {
            min: 2000000,
            max: 3700000,
        },
    }),
    // // Row 12
    createRecord({
        orderNumber: 12,
        productType: SouthColumn.productType.LUU_TRU,
        productName: "SHB5-1P",
        powerDetails: "Hệ bám tải, lưu trữ 5,49kWp 1 pha, pin lưu trữ 5,12 kWh",
        equipmentDetails:
            "Tấm quang năng JA 610W, biến tần DaHai, pin lưu trữ Liman",
        storage: 5.12,
        kwpNumber: 5.49,
        unitPrice: 19000000,
        monthlyDiscountPercentage: 10, // 10%
        minimumDownPaymentPercentage: 10, // 10%
        minimumMonthlyInstallment: 1200000,
        maximumMonthlyInstallment: 1800000,
        minimumRoofInstallationArea: 40,
        returnOnInvestmentYears: 3.81,
        averageMonthlyKwhProduction: 685.08,
        suitableForFamilyMonthly: {
            min: 2000000,
            max: 3000000,
        },
    }),
    // // Row 13
    createRecord({
        orderNumber: 13,
        productType: SouthColumn.productType.LUU_TRU,
        productName: "SHB8-1P",
        powerDetails: "Hệ bám tải, lưu trữ 8,54kWp 1 pha, pin lưu trữ 5,12 kWh",
        equipmentDetails:
            "Tấm quang năng JA 610W, biến tần Deye, pin lưu trữ Liman",
        storage: 5.12,
        kwpNumber: 8.54,
        unitPrice: 20000000,
        monthlyDiscountPercentage: 10, // 10%
        minimumDownPaymentPercentage: 10, // 10%
        minimumMonthlyInstallment: 2000000,
        maximumMonthlyInstallment: 3000000,
        minimumRoofInstallationArea: 55,
        returnOnInvestmentYears: 4.21,
        averageMonthlyKwhProduction: 1014.48,
        suitableForFamilyMonthly: {
            min: 2600000,
            max: 4200000,
        },
    }),
    // // Row 14
    createRecord({
        orderNumber: 14,
        productType: SouthColumn.productType.LUU_TRU,
        productName: "SHB8-1P",
        powerDetails: "Hệ bám tải, lưu trữ 8,54kWp 1 pha, pin lưu trữ 5,12 kWh",
        equipmentDetails:
            "Tấm quang năng JA 610W, biến tần DaHai, pin lưu trữ Liman",
        storage: 5.12,
        kwpNumber: 8.54,
        unitPrice: 19000000,
        monthlyDiscountPercentage: 10, // 10%
        minimumDownPaymentPercentage: 10, // 10%
        minimumMonthlyInstallment: 1900000,
        maximumMonthlyInstallment: 2900000,
        minimumRoofInstallationArea: 65,
        returnOnInvestmentYears: 4.0,
        averageMonthlyKwhProduction: 1014.48,
        suitableForFamilyMonthly: {
            min: 2600000,
            max: 4300000,
        },
    }),
    // // Row 15
    createRecord({
        orderNumber: 15,
        productType: SouthColumn.productType.LUU_TRU,
        productName: "SHB8-1P",
        powerDetails: "Hệ bám tải, lưu trữ 8,54kWp 1 pha, pin lưu trữ 5,12 kWh",
        equipmentDetails:
            "Tấm quang năng JA 610W, biến tần Growat, pin lưu trữ Liman",
        storage: 5.12,
        kwpNumber: 8.54,
        unitPrice: 20000000,
        monthlyDiscountPercentage: 10, // 10%
        minimumDownPaymentPercentage: 10, // 10%
        minimumMonthlyInstallment: 2000000,
        maximumMonthlyInstallment: 3000000,
        minimumRoofInstallationArea: 25,
        returnOnInvestmentYears: 4.21,
        averageMonthlyKwhProduction: 1014.48,
        suitableForFamilyMonthly: {
            min: 2600000,
            max: 4400000,
        },
    }),
    // // Row 16
    createRecord({
        orderNumber: 16,
        productType: SouthColumn.productType.LUU_TRU,
        productName: "SHB11-1P",
        powerDetails:
            "Hệ bám tải, lưu trữ 10,98kWp 1 pha, pin lưu trữ 5,12 kWh",
        equipmentDetails:
            "Tấm quang năng JA 610W, biến tần Growat, pin lưu trữ Liman",
        storage: 5.12,
        kwpNumber: 10.98,
        unitPrice: 18000000,
        monthlyDiscountPercentage: 10, // 10%
        minimumDownPaymentPercentage: 10, // 10%
        minimumMonthlyInstallment: 2300000,
        maximumMonthlyInstallment: 3500000,
        minimumRoofInstallationArea: 40,
        returnOnInvestmentYears: 3.87,
        averageMonthlyKwhProduction: 1278.0,
        suitableForFamilyMonthly: {
            min: 3300000,
            max: 5200000,
        },
    }),
    // // Row 17
    createRecord({
        orderNumber: 17,
        productType: SouthColumn.productType.LUU_TRU,
        productName: "SHB11-3P",
        powerDetails:
            "Hệ bám tải, lưu trữ 10,98kWp 3 pha, pin lưu trữ 5,12 kWh",
        equipmentDetails:
            "Tấm quang năng JA 610W, biến tần Deye, pin lưu trữ Liman",
        storage: 5.12,
        kwpNumber: 10.98,
        unitPrice: 18000000,
        monthlyDiscountPercentage: 10, // 10%
        minimumDownPaymentPercentage: 10, // 10%
        minimumMonthlyInstallment: 2300000,
        maximumMonthlyInstallment: 3500000,
        minimumRoofInstallationArea: 55,
        returnOnInvestmentYears: 3.87,
        averageMonthlyKwhProduction: 1278.0,
        suitableForFamilyMonthly: {
            min: 3300000,
            max: 5300000,
        },
    }),
    // // Row 18
    createRecord({
        orderNumber: 18,
        productType: SouthColumn.productType.LUU_TRU,
        productName: "SHB11-3P",
        powerDetails:
            "Hệ bám tải, lưu trữ 10,98kWp 3 pha, pin lưu trữ 5,12 kWh",
        equipmentDetails:
            "Tấm quang năng JA 610W, biến tần Growat, pin lưu trữ Liman",
        storage: 5.12,
        kwpNumber: 10.98,
        unitPrice: 18000000,
        monthlyDiscountPercentage: 10, // 10%
        minimumDownPaymentPercentage: 10, // 10%
        minimumMonthlyInstallment: 2300000,
        maximumMonthlyInstallment: 3500000,
        minimumRoofInstallationArea: 55,
        returnOnInvestmentYears: 3.87,
        averageMonthlyKwhProduction: 1278.0,
        suitableForFamilyMonthly: {
            min: 3300000,
            max: 5400000,
        },
    }),
    // // Row 19
    createRecord({
        orderNumber: 19,
        productType: SouthColumn.productType.LUU_TRU,
        productName: "SHB15-1P",
        powerDetails:
            "Hệ bám tải, lưu trữ 14,64kWp 1 pha, pin lưu trữ 5,12 kWh",
        equipmentDetails:
            "Tấm quang năng JA 610W, biến tần Deye, pin lưu trữ Liman",
        storage: 5.12,
        kwpNumber: 14.64,
        unitPrice: 18000000,
        monthlyDiscountPercentage: 10, // 10%
        minimumDownPaymentPercentage: 10, // 10%
        minimumMonthlyInstallment: 3100000,
        maximumMonthlyInstallment: 4600000,
        minimumRoofInstallationArea: 83,
        returnOnInvestmentYears: 3.94,
        averageMonthlyKwhProduction: 1673.28,
        suitableForFamilyMonthly: {
            min: 4200000,
            max: 6800000,
        },
    }),
    // // Row 20
    createRecord({
        orderNumber: 20,
        productType: SouthColumn.productType.LUU_TRU,
        productName: "SHB15-3P",
        powerDetails:
            "Hệ bám tải, lưu trữ 14,64kWp 3 pha, pin lưu trữ 5,12 kWh",
        equipmentDetails:
            "Tấm quang năng JA 610W, biến tần Deye, pin lưu trữ Liman",
        storage: 5.12,
        kwpNumber: 14.64,
        unitPrice: 18000000,
        monthlyDiscountPercentage: 10, // 10%
        minimumDownPaymentPercentage: 10, // 10%
        minimumMonthlyInstallment: 3100000,
        maximumMonthlyInstallment: 4600000,
        minimumRoofInstallationArea: 100,
        returnOnInvestmentYears: 3.94,
        averageMonthlyKwhProduction: 1673.28,
        suitableForFamilyMonthly: {
            min: 4200000,
            max: 6900000,
        },
    }),
    // // Row 21
    createRecord({
        orderNumber: 21,
        productType: SouthColumn.productType.LUU_TRU,
        productName: "ECO7-1P",
        powerDetails: "Hệ bám tải, lưu trữ 7,32kWp 1 pha, pin lưu trữ 5,12 kWh",
        equipmentDetails:
            "Tấm quang năng JA 610W, biến tần Growat, pin lưu trữ Liman",
        storage: 5.12,
        kwpNumber: 7.32,
        unitPrice: 16000000,
        monthlyDiscountPercentage: 10, // 10%
        minimumDownPaymentPercentage: 10, // 10%
        minimumMonthlyInstallment: 1400000,
        maximumMonthlyInstallment: 2000000,
        minimumRoofInstallationArea: 150,
        returnOnInvestmentYears: 3.32,
        averageMonthlyKwhProduction: 882.72,
        suitableForFamilyMonthly: {
            min: 2300000,
            max: 3700000,
        },
    }),
    // // Row 22
    createRecord({
        orderNumber: 22,
        productType: SouthColumn.productType.LUU_TRU,
        productName: "ECO12-1P",
        powerDetails: "Hệ bám tải, lưu trữ 12,2kWp 1 pha, pin lưu trữ 5,12 kWh",
        equipmentDetails:
            "Tấm quang năng JA 610W, biến tần Growat, pin lưu trữ Liman",
        storage: 5.12,
        kwpNumber: 12.2,
        unitPrice: 16000000,
        monthlyDiscountPercentage: 10, // 10%
        minimumDownPaymentPercentage: 10, // 10%
        minimumMonthlyInstallment: 2300000,
        maximumMonthlyInstallment: 3400000,
        minimumRoofInstallationArea: 265,
        returnOnInvestmentYears: 3.46,
        averageMonthlyKwhProduction: 1409.76,
        suitableForFamilyMonthly: {
            min: 3600000,
            max: 5800000,
        },
    }),
    // // Row 23
    createRecord({
        orderNumber: 23,
        productType: SouthColumn.productType.LUU_TRU,
        productName: "SHB13-3P",
        powerDetails:
            "Hệ bám tải, lưu trữ 13,42kWp 3 pha, pin lưu trữ 5,12 kWh",
        equipmentDetails:
            "Tấm quang năng JA 610W, biến tần Growat, pin lưu trữ Liman",
        storage: 5.12,
        kwpNumber: 13.42,
        unitPrice: 18000000,
        monthlyDiscountPercentage: 10, // 10%
        minimumDownPaymentPercentage: 10, // 10%
        minimumMonthlyInstallment: 2900000,
        maximumMonthlyInstallment: 4200000,
        minimumRoofInstallationArea: 25,
        returnOnInvestmentYears: 3.92,
        averageMonthlyKwhProduction: 1541.52,
        suitableForFamilyMonthly: {
            min: 3900000,
            max: 6400000,
        },
    }),
    // // Row 24
    createRecord({
        orderNumber: 24,
        productType: SouthColumn.productType.LUU_TRU,
        productName: "SHB17-3P",
        powerDetails:
            "Hệ bám tải, lưu trữ 17,08kWp 3 pha, pin lưu trữ 5,12 kWh",
        equipmentDetails:
            "Tấm quang năng JA 610W, biến tần Growat, pin lưu trữ Liman",
        storage: 5.12,
        kwpNumber: 17.08,
        unitPrice: 18000000,
        monthlyDiscountPercentage: 10, // 10%
        minimumDownPaymentPercentage: 10, // 10%
        minimumMonthlyInstallment: 3700000,
        maximumMonthlyInstallment: 5400000,
        minimumRoofInstallationArea: 25,
        returnOnInvestmentYears: 3.97,
        averageMonthlyKwhProduction: 1936.8,
        suitableForFamilyMonthly: {
            min: 4900000,
            max: 8000000,
        },
    }),
    // Row 25
    createRecord({
        orderNumber: 25,
        productType: SouthColumn.productType.LUU_TRU,
        productName: "SHB5-1P",
        powerDetails:
            "Hệ bám tải, lưu trữ 5,49kWp 1 pha, pin lưu trữ 14,36 kWh",
        equipmentDetails:
            "Tấm quang năng JA 610W, biến tần Deye, pin lưu trữ Liman",
        storage: 14.36,
        kwpNumber: 5.49,
        unitPrice: 20000000,
        monthlyDiscountPercentage: 10, // 10%
        minimumDownPaymentPercentage: 10, // 10%
        minimumMonthlyInstallment: 1300000,
        maximumMonthlyInstallment: 1900000,
        minimumRoofInstallationArea: 27,
        returnOnInvestmentYears: 3.48,
        averageMonthlyKwhProduction: 719.82,
        suitableForFamilyMonthly: {
            min: 2000000,
            max: 3000000,
        },
    }),
    // Row 26
    createRecord({
        orderNumber: 26,
        productType: SouthColumn.productType.LUU_TRU,
        productName: "SHB5-1P",
        powerDetails:
            "Hệ bám tải, lưu trữ 5,49kWp 1 pha, pin lưu trữ 14,36 kWh",
        equipmentDetails:
            "Tấm quang năng JA 610W, biến tần DaHai, pin lưu trữ Liman",
        storage: 14.36,
        kwpNumber: 5.49,
        unitPrice: 19000000,
        monthlyDiscountPercentage: 10, // 10%
        minimumDownPaymentPercentage: 10, // 10%
        minimumMonthlyInstallment: 1200000,
        maximumMonthlyInstallment: 1800000,
        minimumRoofInstallationArea: 27,
        returnOnInvestmentYears: 3.31,
        averageMonthlyKwhProduction: 719.82,
        suitableForFamilyMonthly: {
            min: 2000000,
            max: 3000000,
        },
    }),
    // Row 27
    createRecord({
        orderNumber: 27,
        productType: SouthColumn.productType.LUU_TRU,
        productName: "SHB8-1P",
        powerDetails:
            "Hệ bám tải, lưu trữ 8,54kWp 1 pha, pin lưu trữ 14,36 kWh",
        equipmentDetails:
            "Tấm quang năng JA 610W, biến tần Deye, pin lưu trữ Liman",
        storage: 14.36,
        kwpNumber: 8.54,
        unitPrice: 20000000,
        monthlyDiscountPercentage: 10, // 10%
        minimumDownPaymentPercentage: 10, // 10%
        minimumMonthlyInstallment: 2000000,
        maximumMonthlyInstallment: 3000000,
        minimumRoofInstallationArea: 43,
        returnOnInvestmentYears: 3.85,
        averageMonthlyKwhProduction: 975.9,
        suitableForFamilyMonthly: {
            min: 2600000,
            max: 4200000,
        },
    }),
    // Row 28
    createRecord({
        orderNumber: 28,
        productType: SouthColumn.productType.LUU_TRU,
        productName: "SHB8-1P",
        powerDetails:
            "Hệ bám tải, lưu trữ 8,54kWp 1 pha, pin lưu trữ 14,36 kWh",
        equipmentDetails:
            "Tấm quang năng JA 610W, biến tần DaHai, pin lưu trữ Liman",
        storage: 14.36,
        kwpNumber: 8.54,
        unitPrice: 19000000,
        monthlyDiscountPercentage: 10, // 10%
        minimumDownPaymentPercentage: 10, // 10%
        minimumMonthlyInstallment: 1900000,
        maximumMonthlyInstallment: 2900000,
        minimumRoofInstallationArea: 43,
        returnOnInvestmentYears: 3.66,
        averageMonthlyKwhProduction: 975.9,
        suitableForFamilyMonthly: {
            min: 2600000,
            max: 4300000,
        },
    }),
    // Row 29
    createRecord({
        orderNumber: 29,
        productType: SouthColumn.productType.LUU_TRU,
        productName: "SHB8-1P",
        powerDetails:
            "Hệ bám tải, lưu trữ 8,54kWp 1 pha, pin lưu trữ 14,36 kWh",
        equipmentDetails:
            "Tấm quang năng JA 610W, biến tần Growat, pin lưu trữ Liman",
        storage: 14.36,
        kwpNumber: 8.54,
        unitPrice: 20000000,
        monthlyDiscountPercentage: 10, // 10%
        minimumDownPaymentPercentage: 10, // 10%
        minimumMonthlyInstallment: 2000000,
        maximumMonthlyInstallment: 3000000,
        minimumRoofInstallationArea: 43,
        returnOnInvestmentYears: 3.85,
        averageMonthlyKwhProduction: 975.9,
        suitableForFamilyMonthly: {
            min: 2600000,
            max: 4400000,
        },
    }),
    // Row 30
    createRecord({
        orderNumber: 30,
        productType: SouthColumn.productType.LUU_TRU,
        productName: "SHB11-1P",
        powerDetails:
            "Hệ bám tải, lưu trữ 10,98kWp 1 pha, pin lưu trữ 14,36 kWh",
        equipmentDetails:
            "Tấm quang năng JA 610W, biến tần Growat, pin lưu trữ Liman",
        storage: 14.36,
        kwpNumber: 10.98,
        unitPrice: 18000000,
        monthlyDiscountPercentage: 10, // 10%
        minimumDownPaymentPercentage: 10, // 10%
        minimumMonthlyInstallment: 2300000,
        maximumMonthlyInstallment: 3500000,
        minimumRoofInstallationArea: 55,
        returnOnInvestmentYears: 3.54,
        averageMonthlyKwhProduction: 1180.74,
        suitableForFamilyMonthly: {
            min: 3300000,
            max: 5200000,
        },
    }),
    // Row 31
    createRecord({
        orderNumber: 31,
        productType: SouthColumn.productType.LUU_TRU,
        productName: "SHB11-3P",
        powerDetails:
            "Hệ bám tải, lưu trữ 10,98kWp 3 pha, pin lưu trữ 14,36 kWh",
        equipmentDetails:
            "Tấm quang năng JA 610W, biến tần Deye, pin lưu trữ Liman",
        storage: 14.36,
        kwpNumber: 10.98,
        unitPrice: 18000000,
        monthlyDiscountPercentage: 10, // 10%
        minimumDownPaymentPercentage: 10, // 10%
        minimumMonthlyInstallment: 2300000,
        maximumMonthlyInstallment: 3500000,
        minimumRoofInstallationArea: 55,
        returnOnInvestmentYears: 3.54,
        averageMonthlyKwhProduction: 1180.74,
        suitableForFamilyMonthly: {
            min: 3300000,
            max: 5300000,
        },
    }),
    // Row 32
    createRecord({
        orderNumber: 32,
        productType: SouthColumn.productType.LUU_TRU,
        productName: "SHB11-3P",
        powerDetails:
            "Hệ bám tải, lưu trữ 10,98kWp 3 pha, pin lưu trữ 14,36 kWh",
        equipmentDetails:
            "Tấm quang năng JA 610W, biến tần Growat, pin lưu trữ Liman",
        storage: 14.36,
        kwpNumber: 10.98,
        unitPrice: 18000000,
        monthlyDiscountPercentage: 10, // 10%
        minimumDownPaymentPercentage: 10, // 10%
        minimumMonthlyInstallment: 2300000,
        maximumMonthlyInstallment: 3500000,
        minimumRoofInstallationArea: 55,
        returnOnInvestmentYears: 3.54,
        averageMonthlyKwhProduction: 1180.74,
        suitableForFamilyMonthly: {
            min: 3300000,
            max: 5400000,
        },
    }),
    // Row 33
    createRecord({
        orderNumber: 33,
        productType: SouthColumn.productType.LUU_TRU,
        productName: "SHB15-1P",
        powerDetails:
            "Hệ bám tải, lưu trữ 14,64kWp 1 pha, pin lưu trữ 14,36 kWh",
        equipmentDetails:
            "Tấm quang năng JA 610W, biến tần Deye, pin lưu trữ Liman",
        storage: 14.36,
        kwpNumber: 14.64,
        unitPrice: 18000000,
        monthlyDiscountPercentage: 10, // 10%
        minimumDownPaymentPercentage: 10, // 10%
        minimumMonthlyInstallment: 3100000,
        maximumMonthlyInstallment: 4600000,
        minimumRoofInstallationArea: 73,
        returnOnInvestmentYears: 3.6,
        averageMonthlyKwhProduction: 1488.12,
        suitableForFamilyMonthly: {
            min: 4200000,
            max: 6800000,
        },
    }),
    // Row 34
    createRecord({
        orderNumber: 34,
        productType: SouthColumn.productType.LUU_TRU,
        productName: "SHB15-3P",
        powerDetails:
            "Hệ bám tải, lưu trữ 14,64kWp 3 pha, pin lưu trữ 14,36 kWh",
        equipmentDetails:
            "Tấm quang năng JA 610W, biến tần Deye, pin lưu trữ Liman",
        storage: 14.36,
        kwpNumber: 14.64,
        unitPrice: 18000000,
        monthlyDiscountPercentage: 10, // 10%
        minimumDownPaymentPercentage: 10, // 10%
        minimumMonthlyInstallment: 3100000,
        maximumMonthlyInstallment: 4600000,
        minimumRoofInstallationArea: 73,
        returnOnInvestmentYears: 3.6,
        averageMonthlyKwhProduction: 1488.12,
        suitableForFamilyMonthly: {
            min: 4200000,
            max: 6900000,
        },
    }),
    // Row 35
    createRecord({
        orderNumber: 35,
        productType: SouthColumn.productType.LUU_TRU,
        productName: "ECO7-1P",
        powerDetails:
            "Hệ bám tải, lưu trữ 7,32kWp 1 pha, pin lưu trữ 14,36 kWh",
        equipmentDetails:
            "Tấm quang năng JA 610W, biến tần Growat, pin lưu trữ Liman",
        storage: 14.36,
        kwpNumber: 7.32,
        unitPrice: 16000000,
        monthlyDiscountPercentage: 10, // 10%
        minimumDownPaymentPercentage: 10, // 10%
        minimumMonthlyInstallment: 1400000,
        maximumMonthlyInstallment: 2000000,
        minimumRoofInstallationArea: 37,
        returnOnInvestmentYears: 3.05,
        averageMonthlyKwhProduction: 873.06,
        suitableForFamilyMonthly: {
            min: 2300000,
            max: 3700000,
        },
    }),
    // Row 36
    createRecord({
        orderNumber: 36,
        productType: SouthColumn.productType.LUU_TRU,
        productName: "ECO12-1P",
        powerDetails:
            "Hệ bám tải, lưu trữ 12,2kWp 1 pha, pin lưu trữ 14,36 kWh",
        equipmentDetails:
            "Tấm quang năng JA 610W, biến tần Growat, pin lưu trữ Liman",
        storage: 14.36,
        kwpNumber: 12.2,
        unitPrice: 16000000,
        monthlyDiscountPercentage: 10, // 10%
        minimumDownPaymentPercentage: 10, // 10%
        minimumMonthlyInstallment: 2300000,
        maximumMonthlyInstallment: 3400000,
        minimumRoofInstallationArea: 61,
        returnOnInvestmentYears: 3.17,
        averageMonthlyKwhProduction: 1282.56,
        suitableForFamilyMonthly: {
            min: 3600000,
            max: 5800000,
        },
    }),
    // Row 37
    createRecord({
        orderNumber: 37,
        productType: SouthColumn.productType.LUU_TRU,
        productName: "SHB13-3P",
        powerDetails:
            "Hệ bám tải, lưu trữ 13,42kWp 3 pha, pin lưu trữ 14,36 kWh",
        equipmentDetails:
            "Tấm quang năng JA 610W, biến tần Growat, pin lưu trữ Liman",
        storage: 14.36,
        kwpNumber: 13.42,
        unitPrice: 18000000,
        monthlyDiscountPercentage: 10, // 10%
        minimumDownPaymentPercentage: 10, // 10%
        minimumMonthlyInstallment: 2900000,
        maximumMonthlyInstallment: 4200000,
        minimumRoofInstallationArea: 67,
        returnOnInvestmentYears: 3.64,
        averageMonthlyKwhProduction: 1385.58,
        suitableForFamilyMonthly: {
            min: 3900000,
            max: 6400000,
        },
    }),
    // Row 38
    createRecord({
        orderNumber: 38,
        productType: SouthColumn.productType.LUU_TRU,
        productName: "SHB17-3P",
        powerDetails:
            "Hệ bám tải, lưu trữ 17,08kWp 3 pha, pin lưu trữ 14,36 kWh",
        equipmentDetails:
            "Tấm quang năng JA 610W, biến tần Growat, pin lưu trữ Liman",
        storage: 14.36,
        kwpNumber: 17.08,
        unitPrice: 18000000,
        monthlyDiscountPercentage: 10, // 10%
        minimumDownPaymentPercentage: 10, // 10%
        minimumMonthlyInstallment: 3700000,
        maximumMonthlyInstallment: 5400000,
        minimumRoofInstallationArea: 85,
        returnOnInvestmentYears: 3.65,
        averageMonthlyKwhProduction: 1693.08,
        suitableForFamilyMonthly: {
            min: 4900000,
            max: 8000000,
        },
    }),
];

const SouthData = {
    sunshineHoursCoefficient: SouthSunshineHoursCoefficient,
    averageElectricityPrice: SouthAverageElectricityPrice,
    batteryStorageCoefficient: SouthBatteryStorageCoefficient,
    regionCoefficient: SouthernRegionCoefficient,
    records: SouthRecords,
};

export default SouthData;
