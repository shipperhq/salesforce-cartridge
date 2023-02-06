# ShipperHQ

Integrates the ShipperHQ REST API with Salesforce Commerce Cloud's Storefront Reference Architecture (SFRA).

## Prerequisites
Before performing the steps below, you will need to ensure you have:
1. Created a ShipperHQ account at ShipperHQ.com (https://shipperhq.com/features)
2. Within the ShipperHQ dashboard under Websites created a new website and obtained an API Key and Authentication Code. Note the Scope under which your website is configured (noted in the top right corner of the dashboard). These credentials will be used to connect to ShipperHQ from the cartridge.
3. Download the ShipperHQ cartridge ZIP file from the Salesforce Commerce Cloud Marketplace. Within this ZIP you’ll find the int_shipperhq_sfra directory containing the cartridge

## Setup
1. Import metadata.
   - System object type extension
   - Jobs
   - Services
2. Install *int_shipperhq_sfra* catridge code.
3. Update the site cartridge path adding *int_shipperhq_sfra* before *app_storefront_base* in the path.
4. Configure *ShipperHQ* site preferences.
   - In Business Manager > Merchant Tools > Site Preferences > Custom Preferences select the “ShipperHQ” group
   - Set “Enable” to “Yes,” set “Scope” to match the scope of your website in the ShipperHQ dashboard (see Prerequisites above)
   - Enter the API Key retrieved from ShipperHQ in the “API Key” field and the Authentication Code retrieved from ShipperHQ in the “Password” field
   - save settings
5. Synchronize Shipping Methods
   - Under Business Manager > Administration > Operations > Jobs select “ShipperHQ”
   - Click “Run Now” to run the synchronization Job
   - This Job will import shipping methods configured in ShipperHQ into Commerce Cloud
   - Once the Job has completed, confirm shipping methods have been imported successfully under Business Manager > Merchant Tools > Ordering > Shipping Methods
   - Shipping Methods can be reordered and their order will be respected with future runs of the synchronization Job
   - This Job will need to be rerun whenever new methods are enabled in your ShipperHQ dashboard

Then you are ready to rate in the checkout!

## Optional Configurations
1. Configure Product Attributes (Optional)
Some of ShipperHQ’s functionality requires additional product attributes to be set on products. At a minimum, weight must be set (especially if you are using live rate carriers) but additionally attributes like length, width, height, ship-from origin, shipping group, etc. may be set. Most of these attributes accept plain numeric values (e.g. length, width, height, weight) but others must match values set in ShipperHQ in order to be recognized by ShipperHQ. Therefore, certain attributes as described below are of type Enum of Strings and must be set up prior to using them. We recommend setting these up as 1 word and if the name is more than 1 word use underscores to join, for example shipping_group, origin_1, dim_rule_1.
   - Go to Business Manager > Administration > Site Development > System Object Types > Product > Attribute Definitions
   - Find “shipperHQDimGroups,” “shipperHQShippingGroups,” or “shipperHQWarehouses”
   - For each one ensure that you have entered the corresponding values from your ShipperHQ account. For example, if you have the following Shipping Groups configured in ShipperHQ: “Large,” “Medium,” and “Small”  you would need to edit the “shipperHQShippingGroups” attribute and add additional values with those strings as the Value. The Display Value does not impact processing but it is recommended to keep this the   same as the Value.
     - “shipperHQDimGroups” corresponds to Dimensional Packing Rule Groups in ShipperHQ
     - “shipperHQShippingGroups” corresponds to “Shipping Groups” in ShipperHQ
     - “shipperHQWarehouses” corresponds to “Origins” in ShipperHQ
     - Apply the attribute changes and move on to the next attribute. Repeat for all three of these attributes.

2. Configure Products (Need to do if rates are based off of weights)
   - Under Business Manager > Merchant Tools > Products and Catalogs > Products choose a product and edit
   - In the ShipperHQ section the following can be configured by product:
     - “Origin Warehouse(s)” for merchants fulfilling from multiple locations, supports assignment of products to one or more warehouses pre-configured in ShipperHQ
     - “HS Code” for merchants shipping internationally with real-time duties & tax calculations at checkout enter the 6 or 10 digit HS Code of the product
     - “Ship Length” is the length dimension (other dimensionsare for width, and height respectively)
     - “Shipping Groups” for merchants using ShipperHQ’s Shipping Groups within their ShipperHQ dashboard configuration products can be assigned to one or more Shipping Groups
     - “Fixed Shipping Fee” for merchants who set a fixed shipping price for certain products
     - “Ship Weight” is the weight of the product
     - “Dimensional Rule Group(s)” for merchants using ShipperHQ’s Dimensional Rule Groups to set specific packing rules for certain groups of products


## Integration Points

### Shipping Helpers
Override of *shippingHelpers.js::getApplicableShippingMethods*, where the applicable shipping methods are retrieved and filtered based on a set of criteria. Natively, in-store pick up methods are filtered from the list. This cartridge adds filtering for shipping methods flagged to use ShipperHQ rates that have no corresponding rate returned in the ShipperHQ rate response.

### Shipping Method Model
Override of *shippingMethod.js::getShippingCost* that retrieves the shipping cost associated with the passed shipping method. This override sets the ShipperHQ rate, if it exists, on the corresponding shipping method, else fallsback to the rate configured on the native shipping method.

### Calculate Shipping Hook Override
Registers a hook script to handle application of the ShipperHQ rates, where applicable, to the shipping line item. The native shipping logic handles creation of shipping line items and calculation of shippin rates and charges based on native configurations. This additional logic applies the ShipperHQ rate for eligible shipping methods.

### ShipperHQ Job
This job is responsible for calling the ShipperHQ `/allowed_methods` REST API endpoint to retrieve all possible shipping methods from ShipperHQ, writing them to a file in SFCC native format, and executing the import. This ensures that a native shipping methods exists for every shipping rate that might be returned for a given `/rates` API request. This is a necessity based on SFCC's architecture as well as allows for greater flexibility.

