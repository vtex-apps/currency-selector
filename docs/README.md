📢 Use this project, [contribute](https://github.com/vtex-apps/product-price) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Currency Selector

:warning: **Store using `vtex.binding-selector@1.x` will have to update to `v2`.**

_Upcoming documentation_

**TODO**

- How to use both blocks in the store theme;
- How to configure the label format via site editor using the placehoders `{CurrencySymbol}`, `{CurrencyCode}` and `{CustomLabel}`. Default label is `{CurrencySymbol}`.
- Store using `vtex.binding-selector@1.x` will have to update to `v2`.
- CSS handles `currency-selector`: 'loadingContainer', 'list', 'listElement', 'container', 'container--active', 'relativeContainer','button', 'buttonText';
- CSS handles `current-currency`: 'current-currency';

Currency selector is responsible for allowing the user to change the currency through a dropdown or a select.

Dropdown:
<img width="1335" alt="Captura de Pantalla 2022-01-25 a la(s) 12 40 23" src="https://user-images.githubusercontent.com/96049132/150970690-871708a9-b9d7-4a75-8c2e-cb8ac33bfc4b.png">

Select:
<img width="1440" alt="Captura de Pantalla 2022-01-25 a la(s) 11 47 11" src="https://user-images.githubusercontent.com/96049132/150970788-c02cb323-f5bf-4514-a0b4-4dcf68f73481.png">

It also allows an admin user to customize the label to be displayed in the block via site editor.
Default label is `{CurrencySymbol}`

<img width="1357" alt="Captura de Pantalla 2022-01-25 a la(s) 12 24 21" src="https://user-images.githubusercontent.com/96049132/150968955-3c0b8693-8ef4-4fa4-a321-8752da9203ee.png">

In addition, the customer can configure a customised label for each sales channel through the admin.

## Configuration

### Step 1 - Adding the Currency selector app to your theme's peerDependencies

Add the Currency selector app as a `peerDependency` in your `store-theme`'s `manifest.json` file:

```diff
 "peerDependencies": {
+  "vtex.currency-selector": "1.x"
 }
```

Now, you can use all the blocks exported by the `currency-selector` app. Check out the two blocks available:

| Block name          | Description                                                            |
| ------------------- | ---------------------------------------------------------------------- |
| `current-currency`  | Renders the labelFormat prop and accepts currency selector as a child. |
| `currency-selector` | Renders three posible layouts: dropdown, list and select.              |

### Step 2 - Adding the Currency selector's blocks to your theme's templates

To add the Currency selector's blocks in your theme, you just need to declare them.

For example:

```json
"flex-layout.row#home": {
  "blocks": ["current-currency", "currency-selector"]
},

"current-currency": {
  "props": {
      "labelFormat": "CurrencyCode"
  }
},

"currency-selector": {
  "props": {
      "labelFormat": "CurrencyCode",
      "layout": "select"
  }
},
```

Both blocks has two props in common:

| Prop name     | Type     | Description                                                                                                                                                              | Default value    |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| `labelFormat` | `string` | This property is used to specify the format in which the label will be displayed. Possible values are `CurrencySymbol`, `CurrencyCode` and `CustomLabel`.                | `CurrencySymbol` |
| `blockClass`  | `string` | Block ID of your choosing to be used in [CSS customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization#using-the-blockclass-property). |

On the case of the `currency-selector` block we have an additional _optional_ prop.

| Prop name | Type     | Description                                                                                                            | Default value |
| --------- | -------- | ---------------------------------------------------------------------------------------------------------------------- | ------------- |
| `layout`  | `string` | This property is used to specify how the block will be displayed. Possible values are `dropdown`, `list` and `select`. | `dropdown`    |

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

For the `current-currency` block:
| CSS Handles |
| ------------------- |
| `current-currency` |
