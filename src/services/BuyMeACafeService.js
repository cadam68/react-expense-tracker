import { Log } from "./LogService";
import { settings } from "../Settings";
import { useEffect, useReducer } from "react";

const logger = Log("BuyMeACafeService");
const initialState = { supporters: [], isLoading: false, error: "" };

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "loading":
      return { ...state, isLoading: true, error: "" };

    case "supporters/loaded":
      return { ...state, isLoading: false, supporters: payload };

    case "supporters/test":
      return { ...state, isLoading: false, supporters: [...state.supporters, payload] };

    case "rejected":
      return { ...state, isLoading: false, error: payload ? payload : state.error };

    default:
      throw new Error(`Unknown action ${type}`);
  }
};

const BuyMeACafeService = () => {
  const [{ supporters, isLoading, error }, dispatch] = useReducer(reducer, initialState);

  const fetchSupporters = async (controller) => {
    const signal = controller.signal;
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${settings.baseApiUrl}/supporters`, { signal: signal });
      if (!res.ok) throw new Error("Something went wrong with fetching supporters");
      const data = await res.json();
      console.log("iici-1", data);
      dispatch({ type: "supporters/loaded", payload: data });
    } catch (err) {
      if (err.name === "AbortError") console.log("fetch supporters aborted!");
      dispatch({ type: "rejected", payload: err.name !== "AbortError" ? `There was an error loading data : ${err.message}` : null });
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    let isFetching = true;

    fetchSupporters(controller).finally(() => {
      isFetching = false;
    });

    // Cleanup function to abort fetch when `query` changes
    return () => {
      if (isFetching) controller.abort();
    };
  }, []);

  const testAdd = async () => {
    dispatch({ type: "loading" });
    setTimeout(() => {
      if (Math.floor(Math.random() * 2) == 0)
        dispatch({ type: "supporters/test", payload: { id: new Date(), name: `Do [${new Date()}]`, firstname: "John", creationDate: new Date() } });
      else dispatch({ type: "rejected", payload: `There was an error ...` });
    }, 3000);
  };

  return { supporters, isLoading, error, testAdd };
};

export { BuyMeACafeService };
