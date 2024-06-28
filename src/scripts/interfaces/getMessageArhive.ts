interface GetMessageArhiveInterface {
  id: string;
  type: "MSG_FROM_USER";
  payload: {
    user: {
      login: string;
    };
  };
}

export default GetMessageArhiveInterface;
