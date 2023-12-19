import "./CurrencySelect";
import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import { ContractABI, ContractAddress } from "../contractABI";

const CurrencySelect = () => {
  const contractAddress = ContractAddress;
  const contractABI = ContractABI;
  const [SelectedConversion, setSelectedConversion] = useState("");
  const [price, setPrice] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [IdofSelectedConversion, setIdofSelectedConversion] = useState(0);

  useEffect(() => {
    if (!provider || !signer || !SelectedConversion) {
      return;
    }
    fetchLastFetchedPrice();
  }, [SelectedConversion, provider, signer]);

  const fetchPrice = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this feature!");
      return;
    }
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const localProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(localProvider);
      const localSigner = await localProvider.getSigner();
      setSigner(localSigner);
      const PriceFinderContract = new ethers.Contract(
        contractAddress,
        contractABI,
        localSigner
      );

      const updateTx = await PriceFinderContract.updatePrice(
        IdofSelectedConversion
      );
      await updateTx.wait();

      const fetchedPrice = await PriceFinderContract.getLastFetchedPrice(
        IdofSelectedConversion
      );

      let formattedPrice;
      if (SelectedConversion === "BTC/ETH") {
        formattedPrice = formatBigIntWithDecimals(fetchedPrice, 18);
      } else {
        formattedPrice = formatBigIntWithDecimals(fetchedPrice, 8);
      }
      setPrice(formattedPrice);
    } catch (error) {
      console.error("Error:", error);
      alert("Please check the console.");
    }
  };

  const formatBigIntWithDecimals = (value, decimals) => {
    const divisor = BigInt(10 ** decimals);
    const integerPart = value / divisor;
    let fractionalPart = value % divisor;
    const fractionalPartStr = fractionalPart.toString().padStart(decimals, "0");
    return `${integerPart}.${fractionalPartStr}`;
  };

  const fetchLastFetchedPrice = useCallback(async () => {
    if (!signer || !SelectedConversion) {
      return;
    }

    try {
      const PriceFinderContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const fetchedPrice = await PriceFinderContract.getLastFetchedPrice(
        IdofSelectedConversion
      );
      const formattedPrice =
        SelectedConversion === "BTC/ETH"
          ? formatBigIntWithDecimals(fetchedPrice, 18)
          : formatBigIntWithDecimals(fetchedPrice, 8);

      setPrice(formattedPrice);
    } catch (error) {
      console.error("Error While Fetching price:", error);
    }
  }, [
    signer,
    SelectedConversion,
    contractAddress,
    contractABI,
    IdofSelectedConversion,
  ]);

  useEffect(() => {
    fetchLastFetchedPrice();
  }, [fetchLastFetchedPrice]);

  const ListOFItems = [
    { name: "BTC/ETH", id: 0 },
    { name: "BTC/USD", id: 1 },
    { name: "ETH/USD", id: 2 },
    { name: "LINK/USD", id: 3 },
  ];

  return (
    <div className="CurrencyBox">
      <form>
        {ListOFItems.map((Data, index) => {
          return (
            <div key={index} className="CurrencyGroup">
              <label>
                <input
                  type="radio"
                  checked={SelectedConversion === Data.name ? true : false}
                  value={Data.name}
                  onChange={(e) => [
                    setSelectedConversion(e.target.value),
                    setIdofSelectedConversion(index + 1),
                  ]}
                />
                {Data.name}
              </label>
            </div>
          );
        })}
      </form>
      <button onClick={() => fetchPrice()}>Fetch Price</button>
      {price && (
        <p>
         {SelectedConversion} is {price}
        </p>
      )}
    </div>
  );
};

export default CurrencySelect;
