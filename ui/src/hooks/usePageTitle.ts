import React from "react";
import { useAppDispatch } from "./redux";
import { setTitle } from "../reducers/uiReducer";

const usePageTitle = (pageTitle: string) => {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(setTitle(pageTitle));

    return () => {
      dispatch(setTitle(undefined));
    };
  }, [dispatch, pageTitle]);
};

export default usePageTitle;
