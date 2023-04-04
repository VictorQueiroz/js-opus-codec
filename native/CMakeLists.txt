add_subdirectory(opus)
add_subdirectory(speexdsp-cmake)
add_subdirectory(libopusenc-cmake)

add_library(
    RecTimeWebWorker SHARED
    main.c
)
target_link_libraries(RecTimeWebWorker PUBLIC opus libopusenc speexdsp)
