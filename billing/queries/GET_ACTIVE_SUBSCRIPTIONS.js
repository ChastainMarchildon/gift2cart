import { gql } from "@apollo/client";

export const getActiveSubscriptions = gql`
  {
    appInstallation {
      id
      activeSubscriptions {
        lineItems {
          id
          plan {
            pricingDetails {
              ... on AppRecurringPricing {
                __typename
                price {
                  amount
                  currencyCode
                }
                interval
              }
            }
          }
        }
        id
        name
        status
        test
        trialDays
        createdAt
      }
    }
  }
`;

export const getAppSubscriptionStatus = async (ctx) => {
  const { client } = ctx;
  const isActive = await client
    .query({
      query: getActiveSubscriptions
    })
    .then((response) => {
      if(response.data.currentAppInstallation.activeSubscriptions.length){
        return (response.data.currentAppInstallation.activeSubscriptions.length[0].status === "ACTIVE");
      }
      else{
        return false;
      }
    });

  return isActive;
};
