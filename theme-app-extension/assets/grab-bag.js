class GrabBag extends HTMLButtonElement  {
    constructor() {
      super();
      this.listen();
    }


    listen(collectionArray) {
      var collectionArray;
      var collection = document.getElementById("gb-collection");
      collection = collection.getAttribute('value');
      fetch('/admin/api/2022-01/collections/' + collection + '/products.json')
                .then(res => res.json())
                .then(responseData => {
                  collectionArray = responseData;
                  });

        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.initiatorType === "fetch" && entry.name.toLowerCase().indexOf("cart/update") > 0  || entry.name.toLowerCase().indexOf("cart/add") > 0 || entry.name.toLowerCase().indexOf("cart/change") > 0) {
                console.log('Fetch request detected to', entry.name);               
                fetch('/cart.json')
                .then(res => res.json())
                .then(responseData => {
                    console.log(responseData);
                    this.updateWidget(responseData,collectionArray);
                  })
                .catch(function(error) {
                    this.updateErrorMessage();
                });
              }
              else if(entry.initiatorType === "navigation"){
                console.log('Navigation request detected to', entry.name);               
                fetch('/cart.json')
                .then(res => res.json())
                .then(responseData => {
                    console.log(responseData);
                    this.updateWidget(responseData,collectionArray);
                  })
                  .catch(function(error) {
                    console.log(error);
                });
              }
            }
          });
          
          observer.observe({
            entryTypes: ["resource", "event", "navigation"]
          });

    }

    updateWidget(cartArray, collectionArray){
        var overlay = document.getElementById("gb-overlayContent");
        var giftSelect = document.getElementById("gb-giftContent");
        var notification = document.getElementById("gb-Notification");
        var current = 0;
        var thresholdPrice = document.getElementById("grab-bag").getAttribute("threshold") /100;
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          });
        
        for(i=0; i< cartArray.items.length; i++){
          for(x=0; x < collectionArray.products.length; x++){
            if(collectionArray.products[x].handle === cartArray.items[i].handle){
              var itemTotal = cartArray.items[i].final_price * cartArray.items[i].quantity
              current += itemTotal;
              console.log(cartArray.items[i].handle);
            }
          }
        }
        current = current / 100;
        console.log(current);
        console.log(thresholdPrice);
        if(current >= thresholdPrice){
            for(var i = 0; i<cartArray.items.length; i++){
                if(cartArray.items[i].discounts.length > 0){
                    overlay.innerHTML = "Gift Added"
                    giftSelect.style.display = "none";
                    notification.style.display = "grid";
                    return;
                }
                else{
                    overlay.style.display = "none";
                    giftSelect.style.display = "grid"
                }
                
            }
        }
        else{
            var difference = thresholdPrice - current;
            difference = formatter.format(difference);
            overlay.style.display = "grid"
            giftSelect.style.display = "none"
            overlay.innerHTML = "You're "+ difference + " away from a gift!" 
            console.log("under threshhold")
        }
    }
    

  }
  

  customElements.define('grab-bag', GrabBag, { extends: "button" })