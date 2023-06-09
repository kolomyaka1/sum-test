import { createAsyncThunk } from "@reduxjs/toolkit";
import { ThunkConfig } from "@/store/StateSchema";
import { getUserAuthData } from "@/utils/helpers/getUserAuthData";
import { responseUser } from "@/types/response";
import { userActions } from "@/store/user";

interface loginByUsernameProps {
    username: string;
    password: string;
}

export const loginByUsername = createAsyncThunk<
    void,
    loginByUsernameProps,
    ThunkConfig<string>
    >(
        "loginForm/loginByUsername",
        async ({ username, password }, thunkAPI) => {
            const { extra, rejectWithValue, dispatch } = thunkAPI;

            try {
                const response = await extra.api.get<responseUser[]>("/users");

                if (!response.data) {
                    throw new Error("Произошла ошибка, перезагрузите страницу");
                }

                const authorizedUser = response.data.find((item) => getUserAuthData(item, username, password));

                if (!authorizedUser) {
                    throw new Error("Имя пользователя или пароль введены не верно");
                }

                dispatch(userActions.setAuthData({
                    username: authorizedUser.username,
                    name: authorizedUser.name
                }));
            } catch (e) {
                return rejectWithValue(e.message);
            }
        }
    );