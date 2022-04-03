import md5 from "md5";

const passwordEncrypt = (password: string):string => {
  return md5(password);
};

export default passwordEncrypt;
