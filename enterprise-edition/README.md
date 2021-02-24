<div align="center">
  <a href="https://reactdatagrid.io">
    <img
      width="100%"
      alt="ReactDataGrid demo image"
      src="https://reactdatagrid.io/assets/hero-github-readme.png"
    />
  </a>
</div>

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [ReactDataGrid Enterprise Edition](#reactdatagrid-enterprise-edition)
- [Installation & Getting Started](#installation--getting-started)
- [TypeScript support](#typescript-support)
- [Features](#features)
- [Evaluating and using the Enterprise Edition](#evaluating-and-using-the-enterprise-edition)
- [Documentation](#documentation)
- [Examples](#examples)
- [Client stories](#client-stories)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## ReactDataGrid Enterprise Edition

This is the **Enterprise Edition** of **`ReactDataGrid`**.

The **Enterprise Edition** is a commercial product and it requires a commercial license - please visit [the pricing page](https://reactdatagrid.io/pricing) for more details.

For the **Community Edition** please see [this page](https://github.com/inovua/reactdatagrid/blob/master/community-edition/README.md).

## Installation & Getting Started

Installation the **`ReactDataGrid` Enterprise Edition** is as easy as:

```sh
$ npm install @inovua/reactdatagrid-enterprise --save
```

See the [documentation getting started page](https://reactdatagrid.io/docs) for more details.

## TypeScript support

**`ReactDataGrid`** ships with `TypeScript` definition files so it's fully integrated with your preferred editor to help with autocompletion and type-safety.

## Features

**`ReactDataGrid`** is packed with all the functionality you would expect from an enterprise-grade grid.

As stated before, **`ReactDataGrid`** is built with **`React`** in mind, so it supports popular patterns in the **`React`** world: controlled/uncontrolled props, render props, built with immutability in mind etc.

Here's a list of the features that we support in the **Enterprise Edition**:

- [Live pagination](https://reactdatagrid.io/docs/live-pagination)
- [Grouping](https://reactdatagrid.io/docs/grouping-rows)
- [Locked columns - start and end](https://reactdatagrid.io/docs/locked-columns)
- [Row details](https://reactdatagrid.io/docs/row-details)
- [Pivoting](https://reactdatagrid.io/docs/pivotgrid)
- [Row resize](https://reactdatagrid.io/docs/row-resize)
- [Row reorder](https://reactdatagrid.io/docs/row-reorder)
- [Footer](https://reactdatagrid.io/docs/footer)
- [Locked rows - top and bottom](https://reactdatagrid.io/docs/locked-rows)
- [Master-Detail](https://reactdatagrid.io/docs/master-detail)
- [TreeGrid](https://reactdatagrid.io/docs/tree-grid)

Besides the above, there's a lot more backed into the **Community Edition**, so make sure you explore [our documentation](https://reactdatagrid.io/docs).

## Evaluating and using the Enterprise Edition

The **Enterprise Edition** is a commercial product and it requires a commercial license - please visit [the pricing page](https://reactdatagrid.io/pricing) for more details. Once you buy a license, we'll provide you a license key, so you can start using the **`ReactDataGrid` Enterprise Edition** in your apps.

You are free to evaluate the **Enterprise Edition** of the **`ReactDataGrid`** even without a license key - all the features are available and ready to use, but a license notice will be displayed initially for a few seconds. If you want to remove that, you can [contact us](mailto:contact@reactdatagrid.io) and we'll send you an evaluation license key which you can use for 30 days.

Please note you are not allowed to integrate the **Enterprise Edition** of the **`ReactDataGrid`** into end products or use it for any commercial, productive or training purpose without a valid commercial license. Read [EULA](https://github.com/inovua/reactdatagrid/blob/master/enterprise-edition/LICENSE.md) for more details.

After you purchase and receive your commercial license key, you have to set it in the `licenseKey` prop then you can start using the **`ReactDataGrid`** in development and production.

```tsx
import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
import '@inovua/reactdatagrid-enterprise/index.css';

<ReactDataGrid licenseKey="..." />;
```

Even without a license key, all features are unlocked so you can evaluate **`ReactDataGrid`** and decide whether you need the **Community Edition** or the **Enterprise Edition**.

## Documentation

We're heavily invested into our [documentation](https://reactdatagrid.io/docs) - it ships with full working examples and a live editor. Each prop **`ReactDataGrid`** supports has it's own description and usage example.

Additionally, each feature is clearly presented and has a dedicated page that explains the feature and shows examples of real-life usage. See for example [locked columns](https://reactdatagrid.io/docs/locked-columns), [grouping](https://reactdatagrid.io/docs/grouping-rows), [pivoting](https://reactdatagrid.io/docs/pivotgrid) etc.

## Examples

```tsx
import React from 'react';
import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
import '@inovua/reactdatagrid-enterprise/index.css';

const columns = [
  { name: 'name', header: 'Name', minWidth: 50, defaultFlex: 2 },
  { name: 'age', header: 'Age', maxWidth: 1000, defaultFlex: 1 },
];

const gridStyle = { minHeight: 550 };

const dataSource = [
  { id: 1, name: 'John McQueen', age: 35 },
  { id: 2, name: 'Mary Stones', age: 25 },
  { id: 3, name: 'Robert Fil', age: 27 },
  { id: 4, name: 'Roger Robson', age: 81 },
  { id: 5, name: 'Billary Konwik', age: 18 },
  { id: 6, name: 'Bob Martin', age: 18 },
  { id: 7, name: 'Matthew Richardson', age: 54 },
  { id: 8, name: 'Ritchie Peterson', age: 54 },
  { id: 9, name: 'Bryan Martin', age: 40 },
  { id: 10, name: 'Mark Martin', age: 44 },
  { id: 11, name: 'Michelle Sebastian', age: 24 },
  { id: 12, name: 'Michelle Sullivan', age: 61 },
  { id: 13, name: 'Jordan Bike', age: 16 },
  { id: 14, name: 'Nelson Ford', age: 34 },
  { id: 15, name: 'Tim Cheap', age: 3 },
  { id: 16, name: 'Robert Carlson', age: 31 },
  { id: 17, name: 'Johny Perterson', age: 40 },
];

export default () => (
  <ReactDataGrid
    idProperty="id"
    columns={columns}
    dataSource={dataSource}
    style={gridStyle}
  />
);
```

[Our documentation](https://reactdatagrid.io/docs) contains hundreds of running examples, so please make sure you check that out.

## Client stories

It’s already been used by thousands of users in business-critical apps, so you can trust it from the get-go. Our clients are building their apps with the **`ReactDataGrid`** at the core of their products.

> <i>With the help of the ReactDataGrid, provided by Inovua Trading S.R.L., we have been able to offer our customers the perfect support for state-of-the-art data management in our fleet management solution WEBFLEET.</i>

<a href="https://reactdatagrid.io/client-stories/webfleet" style="font-size: small">--Thomas Boehm, Senior Engineering Manager at Webfleet Solutions, a Bridgestone Company</a>

<hr />

> <i>Enterprise-grade Datagrid component with outstanding feature coverage and second-to-none performance made it a straightforward decision to include it in our cloud-centric on-demand solutions.</i>

<a href="https://reactdatagrid.io/client-stories/pros" style="font-size: small">--Yuri Genin, Lead UI Architect at PROS</a>

## License

**[Enterprise Edition - Commercial license](https://github.com/inovua/reactdatagrid/blob/master/enterprise-edition/LICENSE.md)**
