import { Card, Page, Layout, MediaCard, List, Banner } from "@shopify/polaris";

import AppLoader from "../components/AppLoader";
import Link from "next/link";
import { useAppContext } from "../context/context";

const Index = () => {
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card title="Welcome to Gift2Cart" sectioned>
            <MediaCard
              title="Getting Started"
              description="In order to use Gift2Cart, you'll need to set up a coupon that allows the customer to claim the free gift."
            >
              <img
                alt=""
                width="100%"
                height="100%"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                src="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850"
              />
            </MediaCard>
          </Card>
          <Card title="Setup Steps in Shopify Admin" sectioned>
            <List type="number">
              <List.Item>
                In order to make this a seamless process for the customer, we
                want to make an automatic discount. Open your Shopify admin in a
                new window and navigate to the discounts section.
              </List.Item>
              <List.Item>
                Click on "Create Discount" and select Automatic Discount.
              </List.Item>
              <List.Item>
                In this menu, select the discount type to "Buy X Get Y"{" "}
                <img
                  src="https://i.ibb.co/5W01w50/Create-Discount.png"
                  alt="Create-Discount"
                  border="0"
                  padding-bottom="20px"
                />
              </List.Item>
              <List.Item>
                Under the "Customer Buys" section, input the dollar amount that
                you want to be the minimum threshold for the gift, Make a note
                of this number as we will need to set this one more time.{" "}
              </List.Item>
              <img
                src="https://i.ibb.co/1s685DW/set-Threshold.png"
                alt="Set Threshold"
                border="0"
                padding-bottom="20px"
              />
              <List.Item>
                Next, under "Customer Gets" Select the product that you want to
                offer as a gift, again - make a note of the product as we will
                need to set this one more time.
              </List.Item>
              <img
                src="https://i.ibb.co/fk7Kc0x/Customer-Gets.png"
                alt="Customer-Gets"
                border="0"
                padding-bottom="20px"
              />
              <List.Item>
                The rest of the settings can be customized to suit your needs,
                once you are done hit save and navigate to the Shopify
                Dashboard.
              </List.Item>
            </List>
          </Card>

          <Card title="Setup Steps for Customizing the app" sectioned>
            <Banner title="Important Note">
              <p>
                The Free Gift, Eligible Collection and Threshold Price, MUST
                match what was entered in the Discount Section.
              </p>
            </Banner>
            <List type="number">
              <List.Item>
                From the Shopify dashboard, navigate to your theme customization
                page.
              </List.Item>
              <List.Item>
                Click on "Theme Settings" in the bottom left and then on "App
                Embeds" then, find GiftBasket
              </List.Item>
              <img
                src="https://i.ibb.co/8KW0ztn/app-Embed-Button.png"
                alt="app-Embed-Button"
                border="0"
                padding-bottom="20px"
              />
              <List.Item>
                The 2 important parts here are selecting the exact same item
                that you did when setting up the discount page, as well as the
                same price.
              </List.Item>
              <img
                src="https://i.ibb.co/wwVVTDT/app-Embed-Settings.png"
                alt="app-Embed-Settings"
                border="0"
                padding-bottom="20px"
              />
              <List.Item>
                The rest of the settings here are up to you to adjust to fit
                your needs!
              </List.Item>
            </List>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Index;
