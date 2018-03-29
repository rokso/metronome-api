<h1 align="center">
  <img src="./logo.png" alt="Metronome API" width="50%">
</h1>

🖲 Metronome Token REST API

[![Build Status](https://travis-ci.com/MetronomeToken/metronome-api.svg?token=zFtwnjoHbEAEPUQyswR1&branch=master)](https://travis-ci.com/MetronomeToken/metronome-desktop-wallet)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Index
1. [Requirements](#requirements)
1. [Configuration](#configuration)
1. [Dev Setup](#dev-Setup)
1. [Prod Setup](#prod-setup)
1. [REST API](#rest-api)
1. [Query, Pagination & Sorting](#query-pagination-&-sorting)
1. [WebSockets Events](#websockets-events)
1. [License](#license)

## Requirements

- Node.js v8
- MongoDB v3
- Ethereum node (i.e. Geth or Parity)

## Configuration

The following environment variables are needed for the API to work:

- `MTN__ETH__AUCTION_ADDRESS`: The Auctions Contract Address.

  I.E. `0xfd9d84C87E80aAEDBE7afA50ad0D80B0b59Fe2b9`.

- `MTN__ETH__TOKEN_ADDRESS`: The MTNToken Contract Address

  I.E. `0xfd9d84C87E80aAEDBE7afA50ad0D80B0b59Fe2b9`.

- `MTN__ETH__WEB_SOCKET_URL`: The WebSocket URL of the Ethereum node.

  I.E. `ws://node.metronome.io:8546`.

- `MTN__MONGO__URL`: The MongoDB URL.

  I.E. `mongodb://localhost/mtn`.

- `NEW_RELIC_API_KEY`: New relic Api Key

> You can use `$ npm run config` to check the values that the API will use when you start it.


## Dev Setup

```bash
# Install dependencies
$ npm i

# Run dev mode
$ npm run dev

# Run test cases
$ npm test

# Check config values
$ npm run config
```

## Prod Setup

```bash
# Install dependencies
$ npm i

# Run dev mode
$ npm start
```

## REST API

  - `GET /`

    Will return a JSON object with basic information like project name and versions

    ```json
    {
      "name": "metronome-api",
      "version": "1.0.0"
    }
    ```

  - `GET /config`

    Will return a JSON object with Metronome Contract Addresses.

    ```json
    {
      "tokenAddress": "0x825a2ce3547e77397b7eac4eb464e2edcfaae514",
      "auctionAddress": "0x9aeb1035b327f4f81198090f4183f21ca6fcb040"
    }
    ```

  - `GET /status`

    Will return a 204 HTTP status code while the API is up and running.

  - `GET /event`

    Will return a JSON object that contains an array with all the events processed by the API exporter. This list includes past events and new events retrieved from ETH node through web3. This endpoint will also return the total amount of events.

    ```json
    {
      "count": 2,
      "events": [
        {
          "_id": "552776_0_2",
          "metaData": {
            "address": "0x825A2cE3547e77397b7EAc4eb464E2eDCFaAE514",
            "blockHash": "0x198cf44b2175f0927a19c14c81ff4d0b680b1689cb2688253cd3b6f43219719e",
            "blockNumber": 552776,
            "logIndex": 2,
            "transactionHash": "0x1c31d0459ff37a518acaafb73b75d9fc1db36745c7c3ce8b6025d1ea3a564076",
            "transactionIndex": 0,
            "returnValues": { },
            "event": "Transfer",
            "topics": [ ],
            "timestamp": 1520534045
          }
        },
        {
          "_id": "552776_0_3",
          "metaData": {
            "address": "0xa25A2cE3547e77397b7EAc4eb464E2eDCFaAE511",
            "blockHash": "0x198cf44b2175f0927a19c14c81ff4d0b680b1689cb2688253cd3b6f43219719e",
            "blockNumber": 552776,
            "logIndex": 3,
            "transactionHash": "0x1c31d0459ff37a518acaafb73b75d9fc1db36745c7c3ce8b6025d1ea3a564076",
            "transactionIndex": 0,
            "returnValues": { },
            "event": "Approval",
            "topics": [ ],
            "timestamp": 1520534045
          }
        }
      ]
    }
    ```

    > The event's `_id` is generated by the API based on block number, transaction index and log index.
    > The event's `timestamp` is generated by the API according to block timestamp.
    > The `metaData` object is basically the entire output we retrieved from the ETH node using web3. So this object could contain different properties depending the event.

  - `GET /event/account/:address`

    Will return a JSON object with an array that contains all events matching the given address parameter. The match will be succeded if any of these properties: `metaData.returnValues._from, metaData.returnValues._to, metaData.returnValues._owner, metaData.returnValues._spender` are equals to the given address. This endpoint will also return the total amount matching events.

    I.E. `GET /event/address/0xa25A2cE3547e77397b7EAc4eb464E2eDCFaAE511`

    ```json
    {
      "count": 1,
      "events":[{
        "_id": "552776_0_3",
        "metaData": {
          "address": "0xa25A2cE3547e77397b7EAc4eb464E2eDCFaAE511",
          "blockHash": "0x198cf44b2175f0927a19c14c81ff4d0b680b1689cb2688253cd3b6f43219719e",
          "blockNumber": 552776,
          "logIndex": 3,
          "transactionHash": "0x1c31d0459ff37a518acaafb73b75d9fc1db36745c7c3ce8b6025d1ea3a564076",
          "transactionIndex": 0,
          "returnValues": { },
          "event": "Approval",
          "topics": [ ],
          "timestamp": 1520534045
        }
      }]
    }
    ```

  - `GET /event/:id`

    Will return a JSON object with the event that matchs the given id parameter.

    I.E. `GET /event/552776_0_3`

    ```json
    {
      "_id": "552776_0_3",
      "metaData": {
        "address": "0xa25A2cE3547e77397b7EAc4eb464E2eDCFaAE511",
        "blockHash": "0x198cf44b2175f0927a19c14c81ff4d0b680b1689cb2688253cd3b6f43219719e",
        "blockNumber": 552776,
        "logIndex": 3,
        "transactionHash": "0x1c31d0459ff37a518acaafb73b75d9fc1db36745c7c3ce8b6025d1ea3a564076",
        "transactionIndex": 0,
        "returnValues": { },
        "event": "Approval",
        "topics": [ ],
        "timestamp": 1520534045
      }
    }
    ```

  - `GET /account`

    Will return a JSON object that contains an array with all the accounts stored by the API exporter. Any time an address appears in a new transaction, the exporter updates the MET balance corresponding to that address and stores the value in MongoDB. This endpoint will also return the total amount of accounts.

    ```json
    {
      "count": 2,
      "accounts": [
        {
          "_id": "0x25d99454D94D9459f0aBB06009840A48bD04ca44",
          "balance": "0",
          "updatedAt": "2018-03-20T21:29:02.410Z"
        },
        {
          "_id": "0x0EE6101fE14E198Fc0f617B56A85A3Ae5EaAB245",
          "balance": "999999500000000000000000",
          "updatedAt": "2018-03-20T21:28:31.076Z"
        }
      ]
    }
    ```

    > The account's `_id` is the address and the `balance` is the amount of MET owned by that account. The `balance` is always shown in `wei`.

  - `GET /account/:address`

    Will return a JSON object with the account that matchs the given address parameter.

    I.E. `GET /account/0x0EE6101fE14E198Fc0f617B56A85A3Ae5EaAB245`

    ```json
    {
      "_id": "0x0EE6101fE14E198Fc0f617B56A85A3Ae5EaAB245",
      "balance": "999999500000000000000000",
      "updatedAt": "2018-03-20T21:28:31.076Z"
    },
    ```

## Query, Pagination & Sorting

Endpoints that retrieve multiple results, (like `GET /event` and `GET /account`) allow MongoDB queries, pagination and sorting. You can even combine this features in a single query.

  - Query

    You can set some MongoDB allowed queries using URL query string format to filter and get specific results. Here some examples:

    - Get all events with address equals to 0x825A2cE3547e77397b7EAc4eb464E2eDCFaAE514

      `GET /event?metaData.address=0x825A2cE3547e77397b7EAc4eb464E2eDCFaAE514`

    - Get all accounts with balance equals to 0

      `GET /account?balance=0`

  - Pagination

    You can use the keys `$limit` and `$skip` as query string values to paginate the results. Internally the API uses MongoDB `limit()` and `$skip()` methods.

    - Get first set of 5 events

        `GET /event?$limit=5`

    - Get second set of 5 events

        `GET /event?$limit=5$skip=0`

    > The defaults values are `1000` for `$limit` and `0` for `$skip`

  - Sorting

    You can use the `$sort` key as query string vlaue to set the desired order to retrieve the results. Internally the API uses MongoDB `sort()` method.

    - Get accounts sort by balance

      `GET /account?$sort=balance`

      `GET /account?$sort=-balance`

    - Get events sort by timestamp

      `GET /event?$sort=metaData.timestamp`

      `GET /event?$sort=-metaData.timestamp`

    > Use the prefix `-` to set descending order.

## WebSocket Events

The API is integrated with [socket.io](https://socket.io/) to dispatch different kind of web socket events and be able to handle information by clients in real time. Using the [socket.io client](https://socket.io/docs/client-api/) you must be able to establish a connection with the API and start listening for new events.

```js
import io from 'socket.io-client'
const socket = io('ws://api.met.bloqrock.net') // API URL
```

  - `AUCTION_STATUS_TASK`

    This event is emitted any time the status of MET auction changes. Attaching to this event you can get all needed information of Initial or Daily Auctions through a JSON object.

    ```json
    {
      "currentAuction": "10",
      "currentPrice": "3300000000000",
      "genesisTime": 1520035200,
      "lastPurchasePrice": "3300000000000",
      "lastPurchaseTime": 1521508680,
      "nextAuctionStartTime": 1521590400,
      "tokenCirculation": "10028800000000000000000000",
      "tokenRemaining": "0",
      "tokenSold": "10028800000000000000000000"
    }
    ```

    - Client Implementation

      ```js
      import io from 'socket.io-client'
      const socket = io('ws://api.met.bloqrock.net') // API URL
      socket.on('AUCTION_STATUS_TASK', auctionStatus => console.log(auctionStatus))
      ```

  - `NEW_EVENT`

    This event is emitted any time the API exporter process a new ETH event. Attaching to this event you can get all new ETH events in real time without making HTTP request to REST API.

    ```json
    {
      "_id": "552776_0_3",
      "metaData": {
        "address": "0xa25A2cE3547e77397b7EAc4eb464E2eDCFaAE511",
        "blockHash": "0x198cf44b2175f0927a19c14c81ff4d0b680b1689cb2688253cd3b6f43219719e",
        "blockNumber": 552776,
        "logIndex": 3,
        "transactionHash": "0x1c31d0459ff37a518acaafb73b75d9fc1db36745c7c3ce8b6025d1ea3a564076",
        "transactionIndex": 0,
        "returnValues": { },
        "event": "Approval",
        "topics": [ ],
        "timestamp": 1520534045
      }
    }
    ```
    > The output is the same you get when you request events using REST API events endpoints.

    - Client Implementation
      ```js
      import io from 'socket.io-client'
      const socket = io('ws://api.met.bloqrock.net') // API URL
      socket.on('NEW_EVENT', event => console.log(event))
      ```

  - `LATEST_BLOCK`

    This event is emitted any time a new block is mined. Attaching to this event you can get the entire new block information.

    ```json
    {
      "author": "0x0a194f4b9f5f904ec3b4548d63bee1c55b1d61d6",
      "difficulty": "2628345",
      "extraData": "0xd583010701846765746885676f312e39856c696e7578",
      "gasLimit": 4712388,
      "gasUsed": 0,
      "hash": "0x26475158371994b10caeb098f0efc8c71c18e02f441a43fa9262ed26699ed85b",
      "logsBloom": "",
      "miner": "0x0a194f4b9F5F904EC3b4548d63Bee1C55b1D61d6",
      "mixHash": "0xc58740831a5041fa618ce10d8e072785de37750897a1539835a87d2eea0c4905",
      "nonce": "0x079ad3803a89f70e",
      "number": 623303,
      "parentHash": "0x0e70a313ee49736bdb0f72000d9d0850cb781ea185f56c05dc94f5bdbd8c9c51",
      "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
      "sealFields": [ ],
      "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
      "size": 536,
      "stateRoot": "0xaa584ee7a8d30599cb904a16562424bb0c233fdf2a6a1d3ef8c6eccea7349618",
      "timestamp": 1521584303,
      "totalDifficulty": "431363800748",
      "transactions": [ ],
      "transactionsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
      "uncles": [ ],
    }
    ```

    - Client Implementation
      ```js
      import io from 'socket.io-client'
      const socket = io('ws://api.met.bloqrock.net') // API URL
      socket.on('LATEST_BLOCK', block => console.log(block))
      ```

  - `BALANCE_UPDATED`

    This event is emitted any time a API exporter updates an account's balance. Attaching to this event you can get balances updates in real time

    ```json
    {
      "_id": "0x0EE6101fE14E198Fc0f617B56A85A3Ae5EaAB245",
      "balance": "999999500000000000000000"
    }
    ```

    - Client Implementation
      ```js
      import io from 'socket.io-client'
      const socket = io('ws://api.met.bloqrock.net') // API URL
      socket.on('BALANCE_UPDATED', account => console.log(account))
      ```

## LICENSE
[MIT License](https://github.com/MetronomeToken/metronome-api/blob/develop/LICENSE).