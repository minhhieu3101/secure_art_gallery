cmake_minimum_required(VERSION 3.16)

project(audit LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Find PostgreSQL client library
find_package(PkgConfig REQUIRED)
pkg_check_modules(LIBPQXX REQUIRED libpqxx)

# Find Node.js headers
find_path(
    NODE_API_INCLUDE_DIR
    node_api.h
    PATHS
        $ENV{HOME}/.nvm/versions/node/v22.22.3/include/node
        /opt/homebrew/include/node
        /usr/local/include/node
)

# Find node-addon-api headers
execute_process(
    COMMAND node -p "require('node-addon-api').include"
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}/..
    OUTPUT_VARIABLE NODE_ADDON_API_DIR
    OUTPUT_STRIP_TRAILING_WHITESPACE
)

string(REPLACE "\"" "" NODE_ADDON_API_DIR "${NODE_ADDON_API_DIR}")

add_library(audit MODULE
    audit_logic.cpp
    audit_wrapper.cpp
)

target_include_directories(audit PRIVATE
    ${NODE_API_INCLUDE_DIR}
    ${NODE_ADDON_API_DIR}
    ${LIBPQXX_INCLUDE_DIRS}
)

target_link_directories(audit PRIVATE
    ${LIBPQXX_LIBRARY_DIRS}
)

target_link_libraries(audit PRIVATE
    ${LIBPQXX_LIBRARIES}
)

if(APPLE)
    target_link_options(audit PRIVATE
        "-undefined" "dynamic_lookup"
    )
endif()

target_compile_options(audit PRIVATE
    ${LIBPQXX_CFLAGS_OTHER}
)

target_compile_definitions(audit PRIVATE
    NAPI_CPP_EXCEPTIONS
)

set_target_properties(audit PROPERTIES
    PREFIX ""
    SUFFIX ".node"
)