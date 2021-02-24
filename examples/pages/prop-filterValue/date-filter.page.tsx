/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import DataGrid from '@inovua/reactdatagrid-enterprise';

import moment from 'moment';

import NumberFilter from '@inovua/reactdatagrid-enterprise/NumberFilter';
import DateFilter from '@inovua/reactdatagrid-enterprise/DateFilter';
import DateInput from '@inovua/reactdatagrid-community/packages/Calendar/DateInput';

global.moment = moment;

const gridStyle = { minHeight: 350, marginTop: 10 };

const defaultFilterValue = [
  {
    type: 'string',
    operator: 'contains',
    name: 'lastName',
  },
  {
    name: 'createdOn',
    operator: 'before',
    type: 'date',
    value: null,
  },
];

let dataSource;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      v: '2020-04-20',
      columns: [
        {
          name: 'id',
          type: 'number',
          defaultFlex: 2,
          minWidth: 400,
          filterEditor: NumberFilter,
        },
        { name: 'lastName', header: 'Name', minWidth: 400, defaultFlex: 2 },
        { name: 'firstName', header: 'First', minWidth: 400, defaultFlex: 2 },
        {
          name: 'createdOn',

          defaultWidth: 100,
          dateFormat: 'MM/DD/YYYY',
          render: ({ value, cellProps: { dateFormat } }) =>
            moment(value).format(dateFormat),
          filterEditor: DateFilter,
        },
      ],
    };
  }

  render() {
    return (
      <form
        onSubmit={() => {
          console.log('submit');
        }}
      >
        <DateInput
          dateFormat="YYYY-MM-DD"
          value={this.state.v}
          onChange={v => {
            console.warn('yodate', v);
            this.setState({ v });
          }}
        />
        <DataGrid
          idProperty="id"
          style={gridStyle}
          rowIndexColumn
          licenseKey={process.env.NEXT_PUBLIC_LICENSE_KEY}
          maxRowHeight={60}
          theme="default-light"
          defaultCellSelection={[]}
          defaultFilterValue={defaultFilterValue}
          columns={this.state.columns}
          dataSource={dataSource}
        />
      </form>
    );
  }
}

export default () => <App />;

dataSource = [
  {
    id: 1,
    firstName: 'Fifi',
    lastName: 'Aggett',
    gender: null,
    email: 'fifi.aggett@minyx.com',
    phone: null,
    dateOfBirth: '1981-11-29T00:00:00Z',
    facebook: null,
    twitter: null,
    linkedIn: 'https://www.linkedin.com/fifi.aggett',
    address: '15049 Vera Park',
    permissionToCall: true,
    permissionToEmail: false,
    notes: null,
    createdOn: '2019-06-29T04:38:43Z',
    pictureId: null,
    account: { id: 69, name: 'Hermann, Renner and Wilkinson' },
    createdBy: { id: 6, username: 'barnie.caherny' },
  },
  {
    id: 2,
    firstName: 'Krissie',
    lastName: 'Moy',
    gender: null,
    email: 'krissie.moy@gabtune.com',
    phone: '690-517-5264',
    dateOfBirth: '1981-11-30T00:00:00Z',
    facebook: null,
    twitter: 'https://www.twitter.com/kmoy1',
    linkedIn: 'https://www.linkedin.com/krissie.moy',
    address: '698 Hoffman Circle',
    permissionToCall: true,
    permissionToEmail: true,
    notes: null,
    createdOn: '2017-09-11T12:34:37Z',
    pictureId: null,
    account: { id: 237, name: 'MacGyver Group' },
    createdBy: { id: 8, username: 'lester.janney' },
  },
  {
    id: 3,
    firstName: 'Loralie',
    lastName: 'Steart',
    gender: null,
    email: 'loralie.steart@lajo.com',
    phone: null,
    dateOfBirth: '1981-12-01T00:00:00Z',
    facebook: 'https://www.facebook.com/loralie.steart',
    twitter: null,
    linkedIn: 'https://www.linkedin.com/loralie.steart',
    address: '12 Hovde Park',
    permissionToCall: false,
    permissionToEmail: false,
    notes: null,
    createdOn: '2019-02-15T19:18:59Z',
    pictureId: 7,
    account: { id: 54, name: 'Gleichner-Shanahan' },
    createdBy: { id: 5, username: 'merridie.brealey' },
  },
  {
    id: 4,
    firstName: 'Averell',
    lastName: 'Eingerfield',
    gender: null,
    email: 'averell.eingerfield@gevee.com',
    phone: '571-120-7828',
    dateOfBirth: '1981-12-02T00:00:00Z',
    facebook: null,
    twitter: null,
    linkedIn: 'https://www.linkedin.com/averell.eingerfield',
    address: '8 Kropf Court',
    permissionToCall: false,
    permissionToEmail: false,
    notes: null,
    createdOn: '2019-04-11T00:49:51Z',
    pictureId: null,
    account: { id: 174, name: 'Wehner, Hodkiewicz and Howe' },
    createdBy: { id: 1, username: 'brooke.muslim' },
  },
  {
    id: 5,
    firstName: 'Simonette',
    lastName: 'Ondrousek',
    gender: null,
    email: 'simonette.ondrousek@mynte.com',
    phone: '183-622-2035',
    dateOfBirth: '1981-12-03T00:00:00Z',
    facebook: 'https://www.facebook.com/simonette.ondrousek',
    twitter: null,
    linkedIn: 'https://www.linkedin.com/simonette.ondrousek',
    address: '9 Forster Way',
    permissionToCall: true,
    permissionToEmail: false,
    notes: null,
    createdOn: '2019-11-05T04:35:35Z',
    pictureId: null,
    account: { id: 6, name: 'Nolan-Emard' },
    createdBy: { id: 4, username: 'aline.guerrazzi' },
  },
  {
    id: 6,
    firstName: 'Mace',
    lastName: 'Dalligan',
    gender: null,
    email: 'mace.dalligan@avaveo.com',
    phone: '761-433-2083',
    dateOfBirth: '1981-12-04T00:00:00Z',
    facebook: 'https://www.facebook.com/mace.dalligan',
    twitter: null,
    linkedIn: 'https://www.linkedin.com/mace.dalligan',
    address: '68880 Cody Center',
    permissionToCall: true,
    permissionToEmail: false,
    notes: null,
    createdOn: '2017-07-13T00:06:08Z',
    pictureId: null,
    account: { id: 12, name: 'Cole, Quitzon and Wolff' },
    createdBy: { id: 11, username: 'julee.tomasini' },
  },
  {
    id: 7,
    firstName: 'Roderick',
    lastName: 'Mattheissen',
    gender: null,
    email: 'roderick.mattheissen@tekfly.com',
    phone: null,
    dateOfBirth: '1981-12-05T00:00:00Z',
    facebook: null,
    twitter: null,
    linkedIn: 'https://www.linkedin.com/roderick.mattheissen',
    address: '131 Lakewood Alley',
    permissionToCall: true,
    permissionToEmail: false,
    notes: 'Customizable multi-tasking extranet',
    createdOn: '2019-11-11T14:15:27Z',
    pictureId: null,
    account: { id: 244, name: "D'Amore, Huels and Wilkinson" },
    createdBy: { id: 7, username: 'karoly.garey' },
  },
  {
    id: 8,
    firstName: 'Tabbi',
    lastName: 'Joysey',
    gender: null,
    email: 'tabbi.joysey@gabcube.com',
    phone: '646-898-5344',
    dateOfBirth: '1981-12-06T00:00:00Z',
    facebook: 'https://www.facebook.com/tabbi.joysey',
    twitter: null,
    linkedIn: 'https://www.linkedin.com/tabbi.joysey',
    address: '7545 Warner Hill',
    permissionToCall: false,
    permissionToEmail: true,
    notes: null,
    createdOn: '2017-02-25T20:54:15Z',
    pictureId: 92,
    account: { id: 25, name: 'Kuphal-Bosco' },
    createdBy: { id: 7, username: 'karoly.garey' },
  },
  {
    id: 9,
    firstName: 'Ulick',
    lastName: 'Goracci',
    gender: null,
    email: 'ulick.goracci@thoughtbeat.com',
    phone: '152-886-7037',
    dateOfBirth: '1981-12-07T00:00:00Z',
    facebook: 'https://www.facebook.com/ulick.goracci',
    twitter: null,
    linkedIn: 'https://www.linkedin.com/ulick.goracci',
    address: '527 Hansons Hill',
    permissionToCall: false,
    permissionToEmail: false,
    notes: null,
    createdOn: '2017-07-04T17:31:49Z',
    pictureId: null,
    account: { id: 55, name: 'Medhurst, Osinski and Kiehn' },
    createdBy: { id: 11, username: 'julee.tomasini' },
  },
  {
    id: 10,
    firstName: 'Brittne',
    lastName: 'Jacquemet',
    gender: null,
    email: 'brittne.jacquemet@demimbu.com',
    phone: null,
    dateOfBirth: '1981-12-08T00:00:00Z',
    facebook: null,
    twitter: null,
    linkedIn: 'https://www.linkedin.com/brittne.jacquemet',
    address: '3491 Butternut Lane',
    permissionToCall: false,
    permissionToEmail: true,
    notes: null,
    createdOn: '2018-12-24T23:56:37Z',
    pictureId: null,
    account: { id: 92, name: 'Homenick LLC' },
    createdBy: { id: 12, username: 'broddie.shoveller' },
  },
  {
    id: 11,
    firstName: 'Germana',
    lastName: 'Regardsoe',
    gender: null,
    email: 'germana.regardsoe@zoonoodle.com',
    phone: '219-344-3709',
    dateOfBirth: '1981-12-09T00:00:00Z',
    facebook: null,
    twitter: null,
    linkedIn: null,
    address: null,
    permissionToCall: true,
    permissionToEmail: false,
    notes: null,
    createdOn: '2017-07-10T10:39:16Z',
    pictureId: null,
    account: { id: 214, name: 'McKenzie LLC' },
    createdBy: { id: 1, username: 'brooke.muslim' },
  },
  {
    id: 12,
    firstName: 'Gaven',
    lastName: 'Wixey',
    gender: null,
    email: 'gaven.wixey@thoughtbeat.com',
    phone: '369-366-1296',
    dateOfBirth: '1981-12-10T00:00:00Z',
    facebook: 'https://www.facebook.com/gaven.wixey',
    twitter: null,
    linkedIn: 'https://www.linkedin.com/gaven.wixey',
    address: '4973 Summer Ridge Avenue',
    permissionToCall: true,
    permissionToEmail: false,
    notes: null,
    createdOn: '2017-06-28T11:45:32Z',
    pictureId: null,
    account: { id: 55, name: 'Medhurst, Osinski and Kiehn' },
    createdBy: { id: 6, username: 'barnie.caherny' },
  },
  {
    id: 13,
    firstName: 'Marcelo',
    lastName: 'Richichi',
    gender: null,
    email: 'marcelo.richichi@jabberstorm.com',
    phone: '365-435-5994',
    dateOfBirth: '1981-12-11T00:00:00Z',
    facebook: 'https://www.facebook.com/marcelo.richichi',
    twitter: null,
    linkedIn: 'https://www.linkedin.com/marcelo.richichi',
    address: '27 Hermina Drive',
    permissionToCall: false,
    permissionToEmail: true,
    notes: null,
    createdOn: '2017-03-07T13:33:57Z',
    pictureId: null,
    account: { id: 206, name: 'Robel Group' },
    createdBy: { id: 12, username: 'broddie.shoveller' },
  },
  {
    id: 14,
    firstName: 'Deane',
    lastName: 'Pollett',
    gender: null,
    email: 'deane.pollett@riffpath.com',
    phone: null,
    dateOfBirth: '1981-12-12T00:00:00Z',
    facebook: 'https://www.facebook.com/deane.pollett',
    twitter: null,
    linkedIn: 'https://www.linkedin.com/deane.pollett',
    address: '448 Londonderry Trail',
    permissionToCall: true,
    permissionToEmail: false,
    notes: null,
    createdOn: '2017-05-28T13:48:33Z',
    pictureId: null,
    account: { id: 133, name: 'Nolan Group' },
    createdBy: { id: 5, username: 'merridie.brealey' },
  },
  {
    id: 15,
    firstName: 'Jakob',
    lastName: 'Frounks',
    gender: null,
    email: 'jakob.frounks@youfeed.com',
    phone: '354-448-2772',
    dateOfBirth: '1981-12-13T00:00:00Z',
    facebook: null,
    twitter: null,
    linkedIn: 'https://www.linkedin.com/jakob.frounks',
    address: '5 South Center',
    permissionToCall: false,
    permissionToEmail: true,
    notes: null,
    createdOn: '2017-02-16T23:22:57Z',
    pictureId: null,
    account: { id: 66, name: 'Sawayn-Tillman' },
    createdBy: { id: 10, username: 'avis.grahl' },
  },
  {
    id: 16,
    firstName: 'Mikaela',
    lastName: 'Barenski',
    gender: null,
    email: 'mikaela.barenski@jazzy.com',
    phone: '288-592-0534',
    dateOfBirth: '1981-12-14T00:00:00Z',
    facebook: null,
    twitter: null,
    linkedIn: 'https://www.linkedin.com/mikaela.barenski',
    address: '369 Dixon Way',
    permissionToCall: false,
    permissionToEmail: false,
    notes: null,
    createdOn: '2017-08-07T18:09:36Z',
    pictureId: null,
    account: { id: 157, name: 'Considine-Mraz' },
    createdBy: { id: 9, username: 'teressa.lansly' },
  },
  {
    id: 17,
    firstName: 'Felisha',
    lastName: 'Fairweather',
    gender: null,
    email: 'felisha.fairweather@flashspan.com',
    phone: '892-935-4408',
    dateOfBirth: '1981-12-15T00:00:00Z',
    facebook: null,
    twitter: 'https://www.twitter.com/ffairweatherg',
    linkedIn: 'https://www.linkedin.com/felisha.fairweather',
    address: '849 Glendale Way',
    permissionToCall: true,
    permissionToEmail: true,
    notes: null,
    createdOn: '2017-01-11T02:45:08Z',
    pictureId: null,
    account: { id: 3, name: 'Stiedemann and Sons' },
    createdBy: { id: 2, username: 'alvinia.hannigane' },
  },
  {
    id: 18,
    firstName: 'Hubey',
    lastName: 'Trobey',
    gender: null,
    email: 'hubey.trobey@oyoba.com',
    phone: '767-495-6735',
    dateOfBirth: '1981-12-16T00:00:00Z',
    facebook: 'https://www.facebook.com/hubey.trobey',
    twitter: null,
    linkedIn: 'https://www.linkedin.com/hubey.trobey',
    address: '20 Caliangt Road',
    permissionToCall: true,
    permissionToEmail: false,
    notes: 'Synergized 24 hour implementation',
    createdOn: '2016-11-09T04:53:33Z',
    pictureId: null,
    account: { id: 40, name: 'Rippin, Davis and Mills' },
    createdBy: { id: 2, username: 'alvinia.hannigane' },
  },
  {
    id: 19,
    firstName: 'Ev',
    lastName: 'Gummer',
    gender: null,
    email: 'ev.gummer@fatz.com',
    phone: '706-168-4876',
    dateOfBirth: '1981-12-17T00:00:00Z',
    facebook: null,
    twitter: null,
    linkedIn: 'https://www.linkedin.com/ev.gummer',
    address: '04 Hollow Ridge Street',
    permissionToCall: true,
    permissionToEmail: false,
    notes: null,
    createdOn: '2017-07-04T05:55:39Z',
    pictureId: null,
    account: { id: 68, name: 'Yost, Moen and Kiehn' },
    createdBy: { id: 5, username: 'merridie.brealey' },
  },
  {
    id: 20,
    firstName: 'Yvette',
    lastName: 'Reignould',
    gender: null,
    email: 'yvette.reignould@gigazoom.com',
    phone: '586-273-2581',
    dateOfBirth: '1981-12-18T00:00:00Z',
    facebook: null,
    twitter: 'https://www.twitter.com/yreignouldj',
    linkedIn: 'https://www.linkedin.com/yvette.reignould',
    address: '88 Union Terrace',
    permissionToCall: false,
    permissionToEmail: false,
    notes: null,
    createdOn: '2016-10-29T07:23:54Z',
    pictureId: null,
    account: { id: 7, name: 'Herzog LLC' },
    createdBy: { id: 7, username: 'karoly.garey' },
  },
].map(x => {
  x.createdOn = moment(x.createdOn).format('MM/DD/YYYY');
  console.log(x);
  return x;
});
