📢 Use this project, [contribute](https://github.com/vtex-apps/product-price) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Currency Selector

Currency selector allows users to change the currency / sales channel (trade policy) they are browsing on the store.

`currency-selector` Dropdown:
<img width="1438" alt="Captura de Pantalla 2022-01-26 a la(s) 16 09 59" src="https://user-images.githubusercontent.com/96049132/151189855-60234fa5-bd1a-4f10-a998-2f2a027c6703.png">

`currency-selector` List:
<img width="1335" alt="Captura de Pantalla 2022-01-25 a la(s) 12 40 23" src="https://user-images.githubusercontent.com/96049132/151325475-68d38920-6e7c-4191-a627-c62ee4114d1b.png">

`currency-selector` Select:
<img width="1440" alt="Captura de Pantalla 2022-01-25 a la(s) 11 47 11" src="https://user-images.githubusercontent.com/96049132/150970788-c02cb323-f5bf-4514-a0b4-4dcf68f73481.png">

It also allows an admin user to customize the label to be displayed in both blocks via site editor.
The default label is the token `{CurrencySymbol}` - which represents the currency symbol registered in the sales channel information. The tokens `{CurrencyCode}` and `{CustomLabel}` (registered via admin panel) are also available for interpolation. For more information on how to edit or set the `CustomLabel` go the section `Set a Custom Label through the admin`

<img width="1357" alt="Captura de Pantalla 2022-01-25 a la(s) 12 24 21" src="https://user-images.githubusercontent.com/96049132/150968955-3c0b8693-8ef4-4fa4-a321-8752da9203ee.png">

## Configuration

:warning: **You need to have `vtex.binding-selector@2.x` as a peer dependency.**

:warning: **In order to the app work correctly on binding bounded accounts, the store has to have this app configured: [vtex.binding-countries](https://github.com/vtex-apps/binding-countries/), to ensure that the canonical address for all bindings has the `rootPath` in the URL.**

### Step 1 - Installing and Adding the Currency selector app to your theme's peerDependencies

On the CLI and run: vtex install vtex.currency-selector@1.x

Add the Currency selector app as a `peerDependency` in your `store-theme`'s `manifest.json` file:

```diff
 "peerDependencies": {
+  "vtex.currency-selector": "1.x"
+  "vtex.binding-selector": "2.x"
 }
```

Now, you can use all the blocks exported by the `currency-selector` app. Check out the two blocks available:

| Block name          | Description                                                                  |
| ------------------- | ---------------------------------------------------------------------------- |
| `current-currency`  | Renders only the current currency. Useful to be used as a trigger for modals |
| `currency-selector` | Renders three posible layouts: dropdown, list and select.                    |

### Step 2 - Adding the Currency selector's blocks to your theme's templates

To add the Currency selector's blocks in your theme, you just need to declare them.

For example:

```json
"flex-layout.row#home": {
  "blocks": ["currency-selector"]
},

"currency-selector": {
  "props": {
      "layout": "select"
  }
},
```

`currency-selector`:

| Prop name | Type     | Description                                                                                                            | Default value |
| --------- | -------- | ---------------------------------------------------------------------------------------------------------------------- | ------------- |
| `layout`  | `string` | This property is used to specify how the block will be displayed. Possible values are `dropdown`, `list` and `select`. | `dropdown`    |

`current-currency` doesn't take any props.

### Step 3 - Configuration in the admin

In order to be able to see our blocks it is necessary to add some sales channels to a binding.

Go to your account Admin Panel and under the Account Settings, there will be a new menu item called Currency Selector. Here we will add some sales channels to a binding:

1. Open the sales channel list of the binding you want to configure and click on `ADD`. This will open a modal.

2. In the modal, you can add the sales channels you want to display on your store from a dropdown. After selecting all the ones you want, click `SAVE`.

3. Now you can see the options you selected in that store / binding.

### Set a Custom Label through the admin

In addition, the customer can configure a customised label for each sales channel through the admin.
![edit_label](https://user-images.githubusercontent.com/96049132/151138070-37267f4a-8cf2-4e93-9eae-cd1aeb36dd91.gif)

Go to the same page as in step 3

1. Add sales channels per binding and create a new custom label.
2. Modify the added sales channels. You can edit the custom label or delete the sales channel from the list.

## Customization

To apply CSS customization in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

For the `currency-selector` block:
| CSS Handles |
| ------------------- |
| `loadingContainer` |
| `list` |
| `listElement` |
| `container` |
| `container--active` |
| `relativeContainer` |
| `button` |
| `buttonText` |
| `selectContainer` |

For the `current-currency` block:
| CSS Handles |
| ------------------- |
| `container` |
