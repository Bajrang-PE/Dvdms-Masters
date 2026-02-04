export const createAsyncReducers = (thunks) => (builder) => {
  thunks.forEach(({ thunk, stateKey }) => {
    builder
      .addCase(thunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunk.fulfilled, (state, action) => {
        state.loading = false;
        state[stateKey] = action.payload;
      })
      .addCase(thunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  });
};