# Adding a product directly in Shopify Admin

For when it's just one or two products and the CSV import (see `product-upload-template.csv` / `product-upload-guide.md`) is more setup than it's worth.

## Steps

1. **Products → Add product**
2. Fill in **Title** and **Description** (the long version — this is what shows on the product detail page)
3. Upload the product photo(s) under **Media**
4. Under **Variants**, click **Add options like size or color** → Option name `Size` → values `25ml`, `50ml`, `75ml`, `100ml`. Shopify creates 4 variants automatically — click into each one and set its **Price** and **Compare-at price**
5. Set **Product category** / **Type**, and assign it to the right **Collection(s)** in the right-hand sidebar (Skincare, Body Care, Targeted Care, Soap, Fragrance, or Essential Oils — a product can be in more than one)
6. Scroll down to **Search engine listing** and set the **URL and handle** — lowercase, hyphenated, e.g. `the-cream`. This becomes the product's page address, so keep it short and matching the title
7. Scroll to the very bottom of the page — the 8 custom fields below all appear automatically as their own labeled inputs, since they're already set up on this store
8. Click **Save**

## The 8 custom fields at the bottom of the page

| Field             | What to enter                                                               |
| ----------------- | --------------------------------------------------------------------------- |
| Short Description | One short line for the shop grid cards, e.g. `Gentle & hydrating body wash` |
| Rating            | `0` for a brand-new product with no reviews yet                             |
| Review Count      | `0` for a brand-new product                                                 |
| Benefits          | See below                                                                   |
| Core Ingredients  | See below                                                                   |
| All Ingredients   | Plain text, e.g. `Aqua • Niacinamide • Tea Tree Oil • Ceramides`            |
| How To Use        | See below                                                                   |
| FAQs              | See below                                                                   |

**Benefits, Core Ingredients, How To Use, and FAQs** are typed as JSON — typing these directly into Shopify is easier than the CSV route, because you don't need to double up quote marks the way a spreadsheet cell requires.

Benefits — a plain list of short phrases:

```text
["Benefit one here","Benefit two here","Benefit three here"]
```

Core Ingredients — percent + name pairs:

```text
[{"percent":"3.5%","name":"Niacinamide"},{"percent":"2.0%","name":"Alpha Arbutin"}]
```

How To Use — numbered steps:

```text
[{"num":"01","text":"First step instructions."},{"num":"02","text":"Second step instructions."}]
```

FAQs — question/answer pairs (`defaultOpen` controls whether it's expanded by default on the page):

```text
[{"q":"Your question?","a":"Your answer.","defaultOpen":true}]
```

Copy these patterns exactly, only changing the text inside the quote marks — moving or dropping a bracket, brace, or comma will make Shopify reject the value.

## If a field doesn't appear at the bottom of the product page

That means it's a genuinely new field that hasn't been set up yet — not one of the 8 above. New metafields need a one-time setup step (Settings → Custom data → Products → Add definition) before Shopify will show an input for them, and they also need Storefront API access turned on before the website can actually display them (this second part is easy to forget and won't show an error — it'll just silently not appear on the site). Ask your developer to set up any genuinely new field rather than trying to add it yourself.
