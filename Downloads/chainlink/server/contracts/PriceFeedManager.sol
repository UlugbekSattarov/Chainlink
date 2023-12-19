// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceFeedManager is Ownable {
    // Structure to hold the Chainlink Price Feed details.
    struct PriceFeed {
        AggregatorV3Interface chainlinkFeed;
        string feedName;
    }

    // Mapping of feed IDs to their respective PriceFeed.
    mapping(uint => PriceFeed) public priceFeeds;

    // Mapping of feed IDs to the most recently fetched price.
    mapping(uint => int) public latestPrice;

    // Event for feed address updates.
    event UpdatedFeedAddress(uint indexed feedId, address newFeedAddress, string feedDescription);

    // Event for logging fetched price details.
    event FetchedPrice(string feedDescription, int fetchedPrice);

    constructor() Ownable(msg.sender) {
        // Set up initial Chainlink data feeds.
        priceFeeds[1] = PriceFeed(AggregatorV3Interface(0x5fb1616F78dA7aFC9FF79e0371741a747D2a7F22), "BTC/ETH");
        priceFeeds[2] = PriceFeed(AggregatorV3Interface(0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43), "BTC/USD");
        priceFeeds[3] = PriceFeed(AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306), "ETH/USD");
        priceFeeds[4] = PriceFeed(AggregatorV3Interface(0xc59E3633BAAC79493d908e63626716e204A45EdF), "LINK/USD");
    }

    /**
     * Retrieves and updates the latest price from a specified Chainlink Data Feed.
     * @param feedId the identifier of the feed
     */
    function refreshPrice(uint feedId) public {
        PriceFeed storage selectedFeed = priceFeeds[feedId];
        require(address(selectedFeed.chainlinkFeed) != address(0), "Feed does not exist");

        (
            /* uint80 roundID */,
            int currentPrice,
            /* uint startedAt */,
            /* uint timeStamp */,
            /* uint80 answeredInRound */
        ) = selectedFeed.chainlinkFeed.latestRoundData();

        // Store the latest price for this feed.
        latestPrice[feedId] = currentPrice;

        // Trigger an event with the fetched price and feed name.
        emit FetchedPrice(selectedFeed.feedName, currentPrice);
    }

    /**
     * Returns the most recently fetched price for a given feed.
     * @param feedId the identifier of the feed
     */
    function getLatestPrice(uint feedId) public view returns (int) {
        require(latestPrice[feedId] != 0, "Price has not been fetched yet");
        return latestPrice[feedId];
    }

    /**
     * Allows the owner to update the address of a specific Chainlink Data Feed.
     * @param feedId the identifier of the feed
     * @param newFeedAddress the new Chainlink Data Feed address
     */
    function modifyFeedAddress(uint feedId, address newFeedAddress) public onlyOwner {
        require(newFeedAddress != address(0), "Address cannot be zero.");
        require(feedId > 0 && feedId <= 4, "Invalid feed ID."); // Assuming 4 feeds are present.
        priceFeeds[feedId].chainlinkFeed = AggregatorV3Interface(newFeedAddress);

        // Announce the feed address update.
        emit UpdatedFeedAddress(feedId, newFeedAddress, priceFeeds[feedId].feedName);
    }
}
