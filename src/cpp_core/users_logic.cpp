#include <iostream>
#include <napi.h>
using namespace std;

struct UserData {
    string id;
    string username;
    string password;
    string email;
    string fullname;
    string phoneNumber;
    string dob;
    string activeCode;
    Role role;
    UserStatus status;
};

enum Role {
    USER,
    EMPLOYEE,
    ADMIN
};

enum UserStatus {
    active,
    inactive,
    deleted
};

Napi::Object createUser(
    const Napi::CallbackInfo& info
) {
    Napi::Env env = info.Env();

    string username =
        info[0].As<Napi::String>().Utf8Value();

    string email =
        info[1].As<Napi::String>().Utf8Value();

    string password =
        info[2].As<Napi::String>().Utf8Value();

    Napi::Object userCheck =
        info[3].As<Napi::Object>();

    // Lấy status
    string status =
        userCheck.Get("status")
                 .As<Napi::String>()
                 .Utf8Value();

    // ...
}