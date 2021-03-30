const baseUrl = 'http://localhost:9000/bomain/userSetting';


export const user = {
    HideSecondCurr: '',
    HideLoginDate: '',
    ShowInvoiceBarcode: '',
    SPCode2QuantityPrice: '',
    RDay: '',
    AutoPrintTicket: '',
    ModemL2Cmd: '',
    CIDClearDecimalFormat: '',
    POSSPCharQtyPriceBC: '',
    CIDComPortL1: '',
    InvFontSize: '',
    PrintSizeOnLabel: '',
    SpCode2CheckDigitCount: '',
    BarcodeReaderHideLeftDigitCount: '',
    HideBalanceInStdInvoice: '',
    SPCode1TotalLength: '',
    PrintColorOnLabel: '',
    PSPrinterName: '',
    POSShowKeyboard: '',
    HideCltInfo: '',
    TaxName: '',
    ShowPosNumber: '',
    POSInvoiceLayout: '',
    BarcodePriceName: '',
    ShowTaxInStdInvoice: '',
    SQLServerUser: '',
    POSDefaultNumbersParam: '',
    SColor1: '',
    PrintBarcodeOnA4: '',
    DBName: '',
    CIDNumberOfLines: '',
    A4InvMessage: '',
    CashDrawerCode: '',
    Format_Date: '',
    BGLeft: '',
    SPCode2TotalLength: '',
    POSInvoiceGRIDFontSize: '',
    Message: '',
    InvPaperSize: '',
    BGWidth: '',
    EnableVisualStyle: '',
    CIDComPortDataReader: '',
    AutoClosePOSItemSearch: '',
    CIDPriceLength: '',
    GenerateBarcodeCurDec: '',
    HideEntriesOnFormOpen: '',
    ClientServerPlatform: '',
    HideCashBack: '',
    DisplayLongName: '',
    BarcodeStartNumber: '',
    HideLoyaltyPoints: '',
    LockPOSAfterSave: '',
    SPCode2ItemLength: '',
    SPCode1ItemLength: '',
    DisplayShortName: '',
    BarcodeType: '',
    CIDItemLength: '',
    BGBottom: '',
    PSBottom: '',
    SpCode1CheckDigitCount: '',
    CIDComPortL2: '',
    CmpDefaultSaleInvoice: '',
    SColor2: '',
    GiftBarcodeType: '',
    CmpName: '',
    NbrCopies: '',
    ShowShareInStdInvoice: '',
    BGHeight: '',
    AmountsDecimalInStdInvoice: '',
    HideClientLedger: '',
    RToTime: '',
    OpenCashDrawerAfterSave: '',
    POSFormsTopMost: '',
    ModemL1Cmd: '',
    UpdatePath: '',
    BGPrinterName: '',
    BGRight: '',
    SPCode1: '',
    DataCollectorHideRightDigitCount: '',
    CompanyInfoOnLogo: '',
    HideTraNo: '',
    CIDComPortCustomerDisplay: '',
    CmpDefaultBranch: '',
    PSTop: '',
    SPCode1QuantityPrice: '',
    TPReferenceStartNumber: '',
    HideCmpName: '',
    BarcodeReaderHideRightDigitCount: '',
    TaxSign: '',
    ShowPacksInStdInvoice: '',
    PageWidth: '',
    PSLeft: '',
    LPTUSBCashDrawerPort: '',
    HideTraDate: '',
    ItemNamesFor: '',
    GiftCardMessage: '',
    HideUserBranch: '',
    Language: '',
    ReceiptPaperSize: '',
    ShowCounterOnQuickInvoice: '',
    AmountsDecimalPOSInvoice: '',
    DataCollectorHideLeftDigitCount: '',
    ThirdpartyNameStartSearchLengh: '',
    QtyDecimal: '',
    PSRight: '',
    ShowTaxInStdPurchase: '',
    PageHeight: '',
    RFromTime: '',
    MergeQtyPOS: '',
    CmpDefaultReturnSale: '',
    PrintTicketAsBarcode: '',
    BGTop: '',
    SQLServerName: '',
    SPCode2: '',
    AutoPrintInvoice: '',
    DataCollectorSeparator: '',
    MergeItemsInPaySlip: '',
    PhoneNumberLength: '',
    SQLServerPassword: '',
    CmpDefaultReturnPurchase: '',
    UseCrystalRpt: '',
    CmpDefaultPurchaseInvoice: '',
    SColor3: '',
    CmpDefaultWarehouse: ''
}

export const getUserSettings = (us_cmp_id) => {
    fetch(`${baseUrl}/sel_userSettings?us_cmp_id=${us_cmp_id}`)
        .then(res => {
            // Unfortunately, fetch doesn't send (404 error) into the cache itself
            // You have to send it, as I have done below
            if (res.status >= 400) {
                throw new Error("Server responds with error!");
            }
            return res.json()
        })
        .then(response => {
            if (!response.error) {
                const us_params = [];
                response.map(set => {
                    us_params.push({ param: set.us_parameter, value: set.us_value });
                });
            } else {
                alert(response.error.originalError.message);
            }

        })
        .catch(err => console.log(err))
}

