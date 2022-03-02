class GrabBag extends HTMLButtonElement {
  constructor() {
    super();
    this.listen();
  }

  listen() {
    var collectionArray = [];
    var collection = document.getElementById("gb-collectionID");
    collection = collection.getAttribute("value");

    //Create a list of eligible products from selected collection
    fetch("/admin/api/2022-01/collections/" + collection + "/products.json")
      .then((res) => res.json())
      .then((responseData) => {
        collectionArray = this.createCollectionArray(responseData);
      });

    //Listen for page events to update the widget whenever a product is added/changed/removed
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (
          (entry.initiatorType === "fetch" &&
            entry.name.toLowerCase().indexOf("cart/update") > 0) ||
          entry.name.toLowerCase().indexOf("cart/add") > 0 ||
          entry.name.toLowerCase().indexOf("cart/change") > 0
        ) {
          console.log("Fetch request detected to", entry.name);
          fetch("/cart.json")
            .then((res) => res.json())
            .then((responseData) => {
              this.updateWidget(responseData, collectionArray);
            })
            .catch(function (error) {
              this.updateErrorMessage();
            });
        } else if (entry.initiatorType === "navigation") {
          console.log("Navigation request detected to", entry.name);
          fetch("/cart.json")
            .then((res) => res.json())
            .then((responseData) => {
              this.updateWidget(responseData, collectionArray);
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      }
    });

    observer.observe({
      entryTypes: ["resource", "event", "navigation"],
    });
  }

  async calculateCart(cartArray, collectionArray) {
    var current = 0;
    var thresholdPrice =
      document.getElementById("grab-bag").getAttribute("threshold") / 100;
    var threshholdMet = false;
    var giftAdded = false;
    //Loop through the cart to make sure only items in the selected collection are being applied to the free gift eligibility
    // **Need to account for free items that are also part of the collection i.e one is added as gift, but customer bought others of the same product
    //***** including a loop through the collection AND cart makes the rendering unreliable. Will sometimes show that the cart total is 0, no idea why. */
    // for(var i=0; i< cartArray.items.length; i++){
    //   for(var x=0; x < collectionArray.length; x++){
    //     if(collectionArray[x] === cartArray.items[i].handle){
    //       if(cartArray.items[i].discounted_price == 0){
    //         giftAdded = true;
    //         continue;
    //       }
    //       var itemTotal = cartArray.items[i].final_price * cartArray.items[i].quantity
    //       current += itemTotal;
    //       console.log("The total is: "+ current);
    //     }
    //   }
    // }
    for (var i = 0; i < cartArray.items.length; i++) {
      if (collectionArray.indexOf(cartArray.items[i].handle) !== -1) {
        if (cartArray.items[i].discounted_price == 0) {
          giftAdded = true;
        }
        var itemTotal =
          cartArray.items[i].final_price * cartArray.items[i].quantity;
        current += itemTotal;
      }
    }

    // for(var i=0; i< cartArray.items.length; i++){
    //       if(cartArray.items[i].discounted_price == 0){
    //         giftAdded = true;
    //         continue;
    //       }
    //       if(cartArray.items[i].)
    //       var itemTotal = cartArray.items[i].final_price * cartArray.items[i].quantity
    //       current += itemTotal;
    //       console.log("The total is: "+ current);
    // }

    current = current / 100;
    if (current >= thresholdPrice) {
      threshholdMet = true;
    }
    return {
      threshholdMet: threshholdMet,
      giftAdded: giftAdded,
      cartTotal: current,
    };
  }

  async updateWidget(cartArray, collectionArray) {
    var overlay = document.getElementById("gb-overlayContent");
    var giftSelect = document.getElementById("gb-giftContent");
    var notification = document.getElementById("gb-Notification");
    var collection = document.getElementById("gb-collectionTitle");
    collection = collection.getAttribute("value");
    var thresholdPrice =
      document.getElementById("grab-bag").getAttribute("threshold") / 100;
    var formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    const result = await this.calculateCart(cartArray, collectionArray);
    console.log(result.threshholdMet, result.giftAdded);
    if (result.threshholdMet) {
      if (result.giftAdded) {
        overlay.innerHTML = "🎉Gift Added!🎁";
        overlay.style = "font-size:150%";
        giftSelect.style.display = "none";
        notification.style.display = "grid";
        return;
      } else {
        overlay.style.display = "none";
        giftSelect.style.display = "grid";
      }
    } else {
      var difference = thresholdPrice - result.cartTotal;
      difference = formatter.format(difference);
      overlay.style.display = "grid";
      giftSelect.style.display = "none";
      overlay.innerHTML =
        "Spend " +
        difference +
        " more in the " +
        collection +
        " collection for a <b>free</b> gift! 🎁";
      overlay.style = "font-size:150%";
    }
  }

  createCollectionArray(responseData) {
    console.log("Collection Array response Data:" + responseData);
    var collectionArray = [];
    for (var x = 0; x < responseData.products.length; x++) {
      collectionArray.push(responseData.products[x].handle);
    }
    console.log("Collection Array after parse:" + collectionArray);
    return collectionArray;
  }
}

customElements.define("grab-bag", GrabBag, { extends: "button" });
