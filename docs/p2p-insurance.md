# Peer-to-peer Insurance Proof Of Concept
This is a functional specification document for the Proof Of Concept of a system enabling users to organize into pools of mutual insurance and insurance companies to insure the risk not covered by the pool.

Best viewed with [Markdown Reader Plugin for Chrome](https://chrome.google.com/webstore/detail/markdown-reader/gpoigdifkoadgajcincpilkjmejcaanc?utm_source=chrome-app-launcher-info-dialog).  
Present with [Markdown Slides Plugin for Chrome](https://chrome.google.com/webstore/detail/markdown-slides/ndpkdbdonkcnidnnmdgphflfcojnhoaa?utm_source=chrome-app-launcher-info-dialog).

---
# Peer-to-peer Insurance

> The aim of peer-to-peer insurance concepts is to make insurance cheaper. For this purpose, a certain number of policyholders pool together. In the event of any claim they support each other financially. If there is no claim, the insurance premiums are reduced.  
There are many types of peer-to-peer insurance. This article describes peer-to-peer insurance in the form of the creation of insurance brokers (as opposed to insurance companies). In this model, insurance policyholders will form small groups online. A part of the insurance premiums paid flow into a group fund, the other part to the insurer. Minor damages to the insured policyholder are firstly paid out of this group fund. For claims above the deductible limit the regular insurer is called upon. When there is no insurance claim, the policyholder gets his/her share refunded from the group pool or credited towards the next policy year. If the group pool happens to be empty, a special insurance comes into force.

https://en.wikipedia.org/wiki/Peer-to-peer_insurance

---
# Problem

* Groups of people would like to insure themselves against risks not commonly insured such as ones in sports, travel, farming, small business.
* The insured would like to simplify and automate the process of claiming and getting paid, especially when the insurance event is a matter of public record such as a delayed flight or a weather condition.
* Insurance companies would like to find new revenue streams covering _long tail_ risks but not take the burden of processing small claims.

---
# Solution

* Permissioned Blockchain
  * immutable ledger
  * very low cost of deployment and maintenance
  * fully transparent to instill trust in consumers
  * identity obfuscated to other members

* Chaincode
  * software executed on the blockchain trusted to change records in the ledger
  * automate payouts thru integration with systems of public record and payment
  * members execute chaincode functions based on their roles

---
# Optimization of Insurance Premium

In an ideal situation the sum of all premiums paid to the p2p insurance pool should equal the sum of all claim payouts. However, the number of claims is initially unknown and varies from year to year. A simple optimization mechanism is proposed where the premium is adjusted every year depending on the sum of payouts the previous year. If there's not enough money in the pool to pay for all claims the pool's insurer steps in and covers the difference.

* if there's money left in the pool at the end of the year
  * the premium for the next year is reduced by a fraction of the remainder
  * the remainder is divided and paid back to the members
* if claim payouts exceed the money in the pool
  * the premium for the next year is increased by a fraction of the difference between payouts and premiums
  * the pool's insurer pays the coverage amounts of the claims not paid by the pool

---
# Money

Users can pay for the insurance and get compensated via various mechanisms each having its pros and cons:

* coins: tokens unique for this blockchain. Coins move between accounts representing payments. When users register in the system they convert fiat money to coins via a payment system such as credit card, bank transfer or PayPal. They can also withdraw: convert their coins back to fiat money.
  * _pros_ easy to develop
  * _cons_ for deposit and withdrawal the pool requires an account with a payment system and thus needs an operator registered as a legal entity
* cryptocurrency: the chaincode can invoke gateways to popular cryptocurrency chains such as Bitcoin or Ethereum. These calls can be made within the same transaction and don't involve payment systems.
  * _pros_ does not require a pool operator as a legal entity with a bank account
  * _cons_ users may not have accounts in cryptocurrencies

---

* payment oracle: fiat money is transferred outside of the blockchain by payment systems such as ACH for bank transfers, Stripe for credit cards or PayPal. Clients of these systems are trusted by the users and inform the blockchain of fiat money transferred between users' accounts.
  * _pros_ little friction with familiar payments: users provide their credit cards or bank accounts or PayPal
  * _cons_ requires an account with a payment system and thus needs an operator registered as a legal entity

We choose the _payment oracle_ mechanism for this POC.

---
# Records

Records are stored on the blockchain either as the chaincode's key value sets or tables.

* Pool  
  insurance pool is policy created by members

* MemberPool  
  members may enter many pools so the many-to-many relationship is maintained in a separate table

---
# Actors

Actors are users of various roles in the system. Their ids and roles are defined in the blockchain's member services records. Other attributes may also be defined in the member services or on the blockchain or in a separate persistence store. For the POC it's sufficient to predefine a set of users with all of their attributes in the member services `yaml` files.

* Member  
  person organizing and entering insurance pools

* Insurer  
  insurance company insuring risks exceeding capacity of the pool

---
# Oracles

*Oracle*  is a mechanism to inject events occurring outside of the blockchain. It is a third party agreed to be trusted by all members and operates as a node on the blockchain with special permissions to the chaincode methods.

* Claim Oracle  
  notifies the blockchain that a claim condition is triggered  
  _example_ a public weather service reports no wind. Organizers of a yacht regatta insured themselves against this condition; their claim is processed automatically and they get paid right away to spend on a champaign and lobster lunch for sailors onshore.  
  _example_ a flight tracking service reports a delayed flight. A traveller insured himself against this condition; his claim gets processed automatically and he spends the payout on a night in a hotel.  

---

  _example_ a small crops farmer plants an internet connected moisture sensor, one per acre of his land. When the sensor reports low levels for 30 consecutive days a drought condition is triggered and the farmer gets paid automatically  
  _example_ a hotelier in a developing country insured himself against a power blackout. When a smart electricity meter reports an outage the hotelier gets paid right away to spend on diesel for the hotel's generator to provide uninterrupted power for his guests.

---

* Payment Oracle  
  notifies the blockchain that a transfer of fiat money occurred between members' accounts. Can be a client listening on events in a payment system such as ACH network, Stripe, PayPal.  
  _example_ an ACH client permissioned by the insurance pool operator to listen on events in their accounts payable.  
  Calls the chaincode method to notify the blockchain that a payment of a claim to the insured occurred. The chaincode decrements the size of the pool and adds a record of the claim to the transaction history.   
  _example_ an ACH client permissioned by the pool operator to listen on events in their accounts receivable.  
  Notifies the blockchain of payment of a premium from a member. The chaincode increments the size of the pool and adds a record of the payment the to transaction history.  

---
# Member

Both roles: members and insurers have these attributes.

- id  
  unique id chosen by members  
  _example_ manuel, vladimir, Allianz
- password  
  a secret needs to be passed to the blockchain's member services to authenticate the member to transact
- paymentAccount  
  various payment oracles will identify members by accounts in respective payment systems
  - aba.account  
    composite unique identifier of the member's fiat money bank account used by a bank transfer ACH oracle. When a payment of fiat money occurs the payment oracle will report to the blockchain a money transfer event with parties' bank aba and account numbers.  
    aba: member bank identifier, account: member bank account identifier  
  - paypalEmail  
    for pools selecting PayPal as their payment mechanism

---
# Pool

- id  
  sequential identifier unique within the chaincode
- name  
  descriptive name  
  _example_ JFK flight delay
- trigger  
  a condition reported by claim oracle or approved by a claims processor that triggers a payout to the insured  
  _example_ 1 hour delay of Jet Blue flight 101 on Jun 10 2016: a delay in flight departure making it impossible to board the next flight in a specific itinerary  
  _example_ dryness level over 70% for 30 consecutive days in Arizona: indicates a drought condition
- coverage  
  amount paid to the insured per claim  
  _example_ $300 per flight delayed  
  _example_ $1,000 per acre of farm land affected by drought

---

- premium  
  one time or yearly payment by each member into the pool  
  _example_ one time $10 fee insuring a traveller against a flight delayed in his specific itinerary  
  _example_ yearly $100 fee per acre a small crops farmer pays insuring against drought
- amount  
  current total amount held in the pool
- insurerId  
  member id of the insurance company covering payouts exceeding pool's capacity. Initially not set until an insurer decides to insure the pool  
  _example_ Allianz
- insurerPremium  
  part of the premium paid to the insurance company to insure claims exceeding pool's capacity  
  _example_ $10 of the $100 member premium

---
# Web Application

The POC is presented as a web application with pages offering functionality to 
* Members: create and enter pools
* Insurers: select pools to insure

The following sections describe these pages per actor.

---
# Member: Enter Pool

A public page listing available insurance pools.

name | trigger | coverage | premium |  |
---|---|---|---|---
Drought Arizona | 30 days dryness over 70%, per acre in Arizona in 2016 | $1000 | $100 | enter / insure
JFK flight delay | flight out of JFK delayed over 1 hour in June 2016 | $200 | $10 | enter / insure
No wind Long Island Regatta | wind below 5 knots June 10 2016 in Long Island Sound | $2000 | $100 | enter / insure

When a user clicks _enter_ to select a pool a modal confirmation window comes up prompting to agree to terms and enter the pool. 

https://boughtbymany.com is a p2p insurance broker. Their home page serves as a good example.

For the POC, the user is assumed to be logged in to the web site; otherwise the user is asked to login or create an account.

---
# Member: Create Pool

When a _Create Pool_ button is clicked on the public page a modal window comes up where the user can enter details of a new pool and propose it to other users.

CREATE | Pool
---|---
name | Drought Arizona
trigger | (dropdown of conditions: `Drought Arizona 2016`, `JFK flight delay Jun 2016`)
coverage | $1000
premium | $100

When _Create_ button is clicked a method of the chaincode is called to create a record of the new pool and a record in member-pool table with the creator as its first member.

The pool appears on the Pools public page for other members to enter and for insurers to select to insure.

---
# Insurer: Insure Pool

A representative of an insurance company selects a pool the company finds profitable to insure. In the real world multiple insurance companies bid on a pool and the chaincode selects the one with better terms. For the POC the scenario is simplified.

When _insure_ link is clicked on a row on the public Pools page a modal window comes up prompting the insurer to enter their terms to insure this pool.

INSURE | Pool
---|---
premium | $10

When _Insure_ button is clicked a method of the chaincode is called to add the insurer to the record of the selected pool.

---
# Payment Oracle

For the POC this will be a simple demo page imitating a call from an ACH client informing the blockchain of a money transfer for a premium payment to the pool or a claim payout to member.

TRANSFER | Money |
---|---
from aba.account | 02100210.12345678
to aba.account | 03200320.09876543
amount | $500
purpose | (dropdown of premium, insurerPremium, payout)
id | id of pool, insurer or member

Once the _Transfer_ button is clicked the chaincode's method is invoked with the transfer details entered. The chaincode in turn finds the pool by id and verifies parties of the transfer.

---
# Claim Oracle

For the POC this will be a simple demo page imitating a call from a public service client informing the blockchain of an insurance event.

TRIGGER | Event |
---|---
select | (dropdown of `Drought Arizona 2016`, `JFK flight delay Jun 2016`)

Once the _Trigger_ button is clicked the chaincode's method is invoked to search for all pools whose trigger matches the one selected and marks them as needed to pay their members.

---
# Timing Mechanism

A mechanism: either an oracle or a service offered by the blockchain is to inform the chaincode of progression of time.

For the POC that service can be imitated by an interval service of a browser calling the chaincode's method to progress time and at the same time displaying current month and year on every page. The progression of time in the demo needs to be accelerated so a month is changed every minute, and controlled via _start_ and _stop_ buttons.

















