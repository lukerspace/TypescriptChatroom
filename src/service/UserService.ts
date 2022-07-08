export type UserData = {
  id: string;
  userName: string;
  roomName: string;
};

export class UserService {
  // 自己定義USERMAP為鍵質對，字串與型態 MAP類別
  private userMap: Map<string, UserData>;
  constructor() {
    // 記錄使用者資訊
    this.userMap = new Map();
  }

  //   新增資料
  addUser(data: UserData) {
    this.userMap.set(data.id, data);
  }
  //   移除資料
  removeUser(id: string) {
    if (this.userMap.has(id)) {
      this.userMap.delete(id);
    }
  }
  //   取得到資料
  getUser(id: string) {
    if (!this.userMap.has(id)) return null;

    const data = this.userMap.get(id);
    if (data) {
      return data;
    }
    return null;
  }
  // 呼叫客戶資料顯示
  userDataInfo(id: string, userName: string, roomName: string): UserData {
    return {
      id,
      userName,
      roomName,
    };
  }
}
