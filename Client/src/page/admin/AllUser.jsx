import { useEffect, useState } from "react";

export function AllUser() {
  const [userList, setUserList] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/userList", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == "error") {
          setUserList(["Data Error"]);
        } else {
          setUserList(data);
        }
      });
  }, []);

  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">รายชื่อพนักงาน</h1>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="card">
                <div className="card-header">
                  <div className="d-inline-flex flex-wrap justify-content-between align-items-center w-100">
                    <div className="col-md-4 col-sm-12">
                      <form className="d-flex flex-row flex-wrap justify-content-start align-items-center">
                        <div className="col-md-3 col-sm-12 fw-bold">
                          Search :
                        </div>
                        <input
                          className="form-control col-md-9 col-sm-12"
                          type="text"
                          onChange={(e) => {
                            setSearch(e.target.value);
                          }}
                        />
                      </form>
                    </div>
                    <div
                      className="btn btn-secondary btn-sm col-md-2 col-sm-12"
                      //   onClick={() => setShowAddProduct(true)}
                    >
                      <i className="fa-solid fa-plus me-2"></i>
                      สร้างบัญชีใหม่
                    </div>
                  </div>
                </div>

                <div className="card-body d-flex flex-row flex-wrap justify-content-center align-items-center">
                  <table
                    id="example2"
                    className="table table-bordered table-hover col-8"
                  >
                    <thead>
                      <tr>
                        <th className="col-1 ">ชื่อ</th>
                        <th className="col-1">ตำแหน่ง</th>
                        <th className="col-1 text-center">เพิ่มยา</th>
                        <th className="col-1 text-center">สั่งซื้อ</th>
                        <th className="col-1 text-center">เบิกออก</th>
                        <th className="text-center">การจัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userList
                        .filter((user) => {
                          return search.toLowerCase() == ""
                            ? user
                            : user.name.toLowerCase().includes(search) ||
                                user.surname.toLowerCase().includes(search);
                        })
                        .map((user) => {
                          return (
                            <tr key={user.user_name}>
                              <td>
                                {user.name} {user.surname}
                              </td>
                              <td>{user.role_name}</td>
                              <td className="text-center">
                                {user.add_new == 1 ? (
                                  <i className="bi bi-check-square-fill text-success"></i>
                                ) : (
                                  <i className="bi bi-square"></i>
                                )}
                              </td>
                              <td className="text-center">
                                {user.purchase == 1 ? (
                                  <i className="bi bi-check-square-fill text-success"></i>
                                ) : (
                                  <i className="bi bi-square"></i>
                                )}
                              </td>
                              <td className="text-center">
                                {user.withdraw == 1 ? (
                                  <i className="bi bi-check-square-fill text-success"></i>
                                ) : (
                                  <i className="bi bi-square"></i>
                                )}
                              </td>
                              <td className="col-lg-1 col-md-2 col-sm-1 text-center p-0">
                                <button
                                  className="btn btn-lg btn-primary col-lg-6 col-md-12 col-sm-12 rounded-0"
                                  //   onClick={() => {
                                  //     setShowDetail(true);
                                  //     setKeyID(product.id);
                                  //   }}
                                >
                                  <i className="bi bi-pencil-square"></i>
                                </button>
                                <button
                                  className="btn btn-lg btn-danger col-lg-6 col-md-12 col-sm-12 rounded-0"
                                  //   onClick={() => {
                                  //     deleteProduct(product.id);
                                  //   }}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
