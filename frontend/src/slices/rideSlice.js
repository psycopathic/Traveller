import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApiErrorMessage } from "../services/api";
import {
  createRideRequest,
  fetchFareRequest,
  fetchLocationSuggestionsRequest,
} from "../services/rideService";

const initialState = {
  pickup: "",
  destination: "",
  vehicleType: "",
  pickupSuggestions: [],
  destinationSuggestions: [],
  fare: {},
  activeRide: null,
  loadingFare: false,
  loadingRideCreation: false,
  loadingSuggestions: false,
  error: null,
};

export const fetchLocationSuggestions = createAsyncThunk(
  "ride/fetchLocationSuggestions",
  async ({ input, field }, { rejectWithValue }) => {
    try {
      const suggestions = await fetchLocationSuggestionsRequest(input);
      return { field, suggestions };
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const fetchFare = createAsyncThunk(
  "ride/fetchFare",
  async ({ pickup, destination }, { rejectWithValue }) => {
    try {
      const fare = await fetchFareRequest({ pickup, destination });
      return fare || {};
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const createRide = createAsyncThunk(
  "ride/createRide",
  async ({ pickup, destination, vehicleType }, { rejectWithValue }) => {
    try {
      const ride = await createRideRequest({ pickup, destination, vehicleType });
      return ride;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

const rideSlice = createSlice({
  name: "ride",
  initialState,
  reducers: {
    setPickup: (state, action) => {
      state.pickup = action.payload;
    },
    setDestination: (state, action) => {
      state.destination = action.payload;
    },
    setVehicleType: (state, action) => {
      state.vehicleType = action.payload;
    },
    clearRideError: (state) => {
      state.error = null;
    },
    clearSuggestionsByField: (state, action) => {
      if (action.payload === "pickup") {
        state.pickupSuggestions = [];
        return;
      }

      state.destinationSuggestions = [];
    },
    resetRideFlow: (state) => {
      state.fare = {};
      state.vehicleType = "";
      state.activeRide = null;
      state.pickupSuggestions = [];
      state.destinationSuggestions = [];
      state.loadingFare = false;
      state.loadingRideCreation = false;
      state.loadingSuggestions = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocationSuggestions.pending, (state) => {
        state.loadingSuggestions = true;
      })
      .addCase(fetchLocationSuggestions.fulfilled, (state, action) => {
        state.loadingSuggestions = false;
        state.error = null;

        if (action.payload.field === "pickup") {
          state.pickupSuggestions = action.payload.suggestions;
          return;
        }

        state.destinationSuggestions = action.payload.suggestions;
      })
      .addCase(fetchLocationSuggestions.rejected, (state, action) => {
        state.loadingSuggestions = false;
        state.error = action.payload || "Unable to load location suggestions.";
      })
      .addCase(fetchFare.pending, (state) => {
        state.loadingFare = true;
        state.error = null;
      })
      .addCase(fetchFare.fulfilled, (state, action) => {
        state.loadingFare = false;
        state.error = null;
        state.fare = action.payload;
      })
      .addCase(fetchFare.rejected, (state, action) => {
        state.loadingFare = false;
        state.error = action.payload || "Unable to fetch fare.";
      })
      .addCase(createRide.pending, (state) => {
        state.loadingRideCreation = true;
        state.error = null;
      })
      .addCase(createRide.fulfilled, (state, action) => {
        state.loadingRideCreation = false;
        state.error = null;
        state.activeRide = action.payload;
      })
      .addCase(createRide.rejected, (state, action) => {
        state.loadingRideCreation = false;
        state.error = action.payload || "Unable to create ride.";
      });
  },
});

export const {
  setPickup,
  setDestination,
  setVehicleType,
  clearRideError,
  clearSuggestionsByField,
  resetRideFlow,
} = rideSlice.actions;

export default rideSlice.reducer;