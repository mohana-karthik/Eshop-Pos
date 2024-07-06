import {createSlice,createAsyncThunk, createAction} from "@reduxjs/toolkit";
import invoiceService from "./invoiceService";

export const getInvoices = createAsyncThunk(
    "invoice/get-invoices",
    async (thunkAPI) => {
      try {
        return await invoiceService.getInvoices();
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );
  export const getAInvoice = createAsyncThunk(
    "invoice/get-invoice",
    async (id,thunkAPI) => {
      try {
        return await invoiceService.getInvoice(id);
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );

  export const createInvoices = createAsyncThunk(
    "invoice/create-invoice",
    async (invoiceData,thunkAPI) => {
      try {
        return await invoiceService.createInvoice(invoiceData);
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );
  export const updateAInvoice = createAsyncThunk(
    "invoice/update-invoice",
    async (invoice,thunkAPI) => {
      try {
        return await invoiceService.updateInvoice(invoice);
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );
  export const getSingle= createAsyncThunk(
    "invoice/singleinvoice",
    async (id, thunkAPI) => {
      try {
        return await invoiceService.getSingle(id);
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );
  export const deleteAInvoice = createAsyncThunk(
    "invoice/delete-invoice",
    async (id,thunkAPI) => {
      try {
        return await invoiceService.deleteInvoice(id);
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  ); 
  export const getMonthlyReport = createAsyncThunk(
    'invoice/monthlyData',
    async (_, thunkAPI) => {
      try {
        const response = await invoiceService.getMonthlyInvoices();
        console.log('Monthly Report Response: ', response); // Log the response
        return response;
      } catch (error) {
        console.error('Error fetching monthly invoices: ', error);
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );
  
  export const getYearlyReport = createAsyncThunk(
    'invoice/yearlyData',
    async (_, thunkAPI) => {
      try {
        const response = await invoiceService.getYearlyInvoice();
        console.log('Yearly Report Response: ', response); // Log the response
        return response;
      } catch (error) {
        console.error('Error fetching yearly invoices: ', error);
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );
  
  export const resetState = createAction("Reset_all");
const initialState ={
    invoices: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
}
export const invoiceSlice = createSlice({
    name:"invoices",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getInvoices.pending,(state)=>{
            state.isLoading = true;
        }).addCase(getInvoices.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.invoices = action.payload;
        })
        .addCase(getInvoices.rejected,(state,action)=>{
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
           state.message = action.error;
        })
        .addCase(createInvoices.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(createInvoices.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.createdInvoice = action.payload;
        })
        .addCase(createInvoices.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(getSingle.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getSingle.fulfilled, (state, action) => {
          state.isError = false;
          state.isLoading = false;
          state.isSuccess = true;
          state.singleinvoice = action.payload;
          state.message = "success";
        })
        .addCase(getSingle.rejected, (state, action) => {
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
          state.isLoading = false;
        })
        .addCase(getAInvoice.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getAInvoice.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.invoiceName = action.payload;
        })
        .addCase(getAInvoice.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(updateAInvoice.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(updateAInvoice.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.updatedInvoice = action.payload;
        })
        .addCase(updateAInvoice.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(getMonthlyReport.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getMonthlyReport.fulfilled, (state, action) => {
          state.isError = false;
          state.isLoading = false;
          state.isSuccess = true;
          state.monthlyData = action.payload;
          state.message = "success";
        
        })
        .addCase(getMonthlyReport.rejected, (state, action) => {
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
          state.isLoading = false;
        })
        
        .addCase(getYearlyReport.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getYearlyReport.fulfilled, (state, action) => {
          state.isError = false;
          state.isLoading = false;
          state.isSuccess = true;
          state.yearlyData = action.payload;
          state.message = "success";
        })
        .addCase(getYearlyReport.rejected, (state, action) => {
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
          state.isLoading = false;
        })
  
        .addCase(deleteAInvoice.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(deleteAInvoice.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.deletedInvoice = action.payload;
        })
        .addCase(deleteAInvoice.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })

        .addCase(resetState, () => initialState);
        
    },
});
export default invoiceSlice.reducer;
