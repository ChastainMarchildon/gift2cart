import "isomorphic-fetch";
import { gql } from "apollo-boost";

export function RECURRING_CREATE(url) {
  return gql`
    mutation {
      appSubscriptionCreate(
          name: "Standard Subscription"
          returnUrl: "${url}"
          test: true
          trialDays: 14,
          lineItems: [
          {
            plan: {
              appUsagePricingDetails: {
                  cappedAmount: { amount: 10, currencyCode: USD }
                  terms: "14 day free trial, $10 USD monthly for unlimited app use afterwards."
              }
            }
          }
          {
            plan: {
              appRecurringPricingDetails: {
                  price: { amount: 10, currencyCode: USD }
              }
            }
          }
          ]
        ) {
            userErrors {
              field
              message
            }
            confirmationUrl
            appSubscription {
              id
            }
        }
    }`;
}

export const getSubscriptionUrl = async (ctx, shop, host) => {
  const { client } = ctx;
  var postredirct = `${process.env.HOST}/?shop=${shop}&host=${host}`;
  const confirmationUrl = await client
    .mutate({
      mutation: RECURRING_CREATE(postredirct),
    })
    .then((response) => response.data.appSubscriptionCreate.confirmationUrl);

  return ctx.redirect(confirmationUrl);
};

const GET_SUBSCRIPTION = gql`
  query {
    currentAppInstallation {
      activeSubscriptions {
        status
      }
    }
  }
`;

export const getAppSubscriptionStatus = async (ctx) => {
  const { client } = ctx;
  const isActive = await client
    .query({
      query: GET_SUBSCRIPTION,
    })
    .then((response) => {
      if (response.data.currentAppInstallation.activeSubscriptions.length) {
        return ctx.redirect(`/?shop=${shop}&host=${host}`);
      } else {
        return false;
      }
    });

  return isActive;
};
