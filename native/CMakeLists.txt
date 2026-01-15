cmake_minimum_required(VERSION 3.16)

add_subdirectory(opus)
add_subdirectory(speexdsp-cmake)
add_subdirectory(libopusenc-cmake)

add_library(
    RecTimeWebWorker STATIC
    opus_js_getters_and_setters.c main.c
)
target_link_libraries(RecTimeWebWorker PUBLIC c opus libopusenc speexdsp)
