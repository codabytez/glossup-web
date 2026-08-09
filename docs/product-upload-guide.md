# How to upload new products — guide for the GlossUp team

This uses `product-upload-template.csv` in this same folder. Open it in Excel, Google Sheets, or Numbers.

## The short version

1. Open the CSV. Row 2 is a **fully filled-in example** ("The Wash") — copy that row's _pattern_, not its content, for each new product.
2. Rows 3–5 (also "the-wash") are its other sizes — one row per size, same "URL handle," everything else blank except SKU/Size/Price.
3. Rows 6–9 are a **blank starter block** — duplicate this 4-row group for every new product.
4. Save as CSV, then in Shopify: **Products → Import** → upload the file.

## Filling in the easy columns

Most columns are self-explanatory:

| Column                   | What it is                                                                                                                             |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| Title                    | Product name — only on the _first_ row of each product, blank on the size rows below it                                                |
| URL handle               | Lowercase, hyphenated version of the title (e.g. "The Cream" → `the-cream`) — **must be identical** on all 4 rows for the same product |
| Description              | The long description shown on the product page                                                                                         |
| Product image URL        | Must be a real, public web address (not a file on your computer) — ask your developer to upload the image first if you don't have one  |
| SKU                      | Your own internal product code, one per size                                                                                           |
| Option1 value            | The size: `25ml`, `50ml`, `75ml`, or `100ml`                                                                                           |
| Price / Compare-at price | In Naira, numbers only, no ₦ or commas (e.g. `19900` not `₦19,900`)                                                                    |

## Filling in the trickier columns

These 6 columns are how the actual product page gets its content — ratings, benefits, ingredients, etc. Fill them in **only on the first row of each product** (leave blank on the size rows below).

**Short Description** — one short line, shown on the shop grid cards. Example: `Gentle & hydrating body wash`

**Rating** / **Review Count** — leave both as `0` for a brand-new product with no reviews yet.

**Benefits, Core Ingredients, How To Use, FAQs** — these four need to be typed in a specific bracketed format. The safest way: **copy the exact cell from row 2 (The Wash) as your starting point**, then only change the text between the quote marks — don't add, remove, or move any punctuation.

Example — Benefits column, for a product with 3 benefits:

```text
["Benefit one here","Benefit two here","Benefit three here"]
```

Just a list of short phrases, each wrapped in quotes, separated by commas, inside square brackets.

Example — Core Ingredients, for 2 ingredients:

```text
[{"percent":"3.5%","name":"Niacinamide"},{"percent":"2.0%","name":"Alpha Arbutin"}]
```

Each ingredient is `{"percent":"X%","name":"Ingredient Name"}`, separated by commas.

Example — How To Use, for 2 steps:

```text
[{"num":"01","text":"First step instructions."},{"num":"02","text":"Second step instructions."}]
```

Example — FAQs, for 1 question:

```text
[{"q":"Your question?","a":"Your answer.","defaultOpen":true}]
```

**If this feels fiddly:** it's completely fine to leave these 4 columns blank in the CSV and fill everything else in (title, price, images, description) — then send the plain-text version of the benefits/ingredients/steps/FAQs (just as a normal list, no special formatting) to your developer, who can add them directly in Shopify afterward in a couple of minutes. Getting the base product live is the priority; these details can follow.

## One thing that will bite you if skipped

Any new custom field (a metafield beyond the 7 already listed above) needs to be told it's allowed to be shown on the website _before_ it'll actually appear — this is a one-time setup step per field, done in Shopify Admin (Settings → Custom data), not something that happens automatically from the CSV. If you're only using the columns already in this template, you don't need to worry about this — it's already been done for all of them.
