const sentReceipt = (order, menu, user) => {
    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Receipt for order</title>
  <style type="text/css" rel="stylesheet" media="all">
    /* Base ------------------------------ */
    *:not(br):not(tr):not(html) {
      font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
    body {
      width: 100% !important;
      height: 100%;
      margin: 0;
      line-height: 1.4;
      background-color: #F5F7F9;
      color: #839197;
      -webkit-text-size-adjust: none;
    }
    .order{
      width: 100%;
      height: 240px;
      display: flex;
      margin-bottom: 2rem;
    }
    .order-left{
      width: 230px;
    }  
    .order-right{
      width: 680px;
      border: 1px solid;
      padding: 1rem;
    }
    .order-right-body{
      text-transform: capitalize;
      color: black;
      width: 100%;
      font-size: 16px;
      margin: 3px 0;
      line-height: 1.5625em;
      text-align: left;
    }
    .order-right-subheader{
      font-size: 14px;
      color: #7e7b8a;
      margin: 3px 0;
      text-transform: capitalize;
    }
    .order-right-header{
      font-size: 20px;
      color: black;
      margin:0;
      font-weight: 600;
      text-transform: capitalize;
    }
    .order-right-box {
      width: 210px;
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
    <div>
        <p>Hi ${user.name}</p>
        <p> Thanks for your recent order. Please find all the details below.</p>
    </div>
    <div class="order">
      <img class="order-left" src=${menu.image.URL} />
      <div class="order-right">
        <div>
          <p class="order-right-subheader">${ order.orderId }</p>
          <p class="order-right-header">${ menu.name }</p>
          <p class="order-right-body">${ menu.shop.name }</p>
          <p class="order-right-body">Payment Method: ${ order.paymentMethod }</p>
          <p class="order-right-body">${ order.address }</p>
          <p class="order-right-body">Cummulated Calories: ${order.calorie}${order.calorieUnit}</p>
        </div>
        <div class="order-right-box">
          <p class="order-right-body">Qty: ${order.quantity}</p>
          <p class="order-right-body">Total: ${order.currency}${order.total}</p>
        </div>
      </div>
    </div>
</body>
</html>
    `
};

module.exports = sentReceipt
