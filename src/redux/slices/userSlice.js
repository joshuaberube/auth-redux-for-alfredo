import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  isNewUser: false,
  isUserLoggedIn: false,
  user: {},
  status: 'idle',
  error: null
}

export const login = createAsyncThunk('user/login', async (userCredentials, thunkAPI) => {
  const { isNewUser } = thunkAPI.getState().user

  try {
    const {data: user} = await axios.post(`/api/user/${isNewUser ? 'register' : 'login' }`, userCredentials)
    return user
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.request.response)
  }
})

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    changeIsNewUser: state => {
      state.isNewUser = !state.isNewUser
    }
  },
  extraReducers: {
    [login.fulfilled]: (state, action) => {
      state.isUserLoggedIn = true
      state.status = 'success'
      state.user = action.payload
    },
    [login.pending]: state => {
      state.status = 'pending'
    },
    [login.rejected]: (state, action) => {
      state.error = action.payload
      state.status = 'failed'
    }
  }
})
export const { changeIsNewUser } = userSlice.actions

export const selectIsNewUser = state => state.user.isNewUser

export default userSlice.reducer