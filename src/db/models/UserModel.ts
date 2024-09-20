import DbModel from './DbModel';
export default class UserModel extends DbModel {
  constructor() {
    super('users', 'id', ['email', 'password', 'name']);
  }

  // additional methods if necessary.
}
