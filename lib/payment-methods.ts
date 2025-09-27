export const paymentMethods = [
  {
    id: "instapay",
    name: "InstaPay",
    fee: 0.5,         // نسبة الرسوم %
    minAmount: 10,    // الحد الأدنى للمبلغ
    accountDetails: "yourbank@instapay", // التفاصيل التي ستعرض للمستخدم
  },
  {
    id: "vodafone",
    name: "Vodafone Cash",
    fee: 1,
    minAmount: 20,
    accountDetails: "010xxxxxxxx",  // رقم فودافون كاش أو أي حساب
  },
  {
    id: "paypal",
    name: "PayPal",
    fee: 2.5,
    minAmount: 5,
    accountDetails: "youremail@paypal.com",
  },
  // ممكن تضيف طرق دفع أخرى كما تحتاج
]
