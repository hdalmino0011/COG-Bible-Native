cmake_minimum_required(VERSION 3.22.1)

project("smooth_engine")

add_library(smooth_engine SHARED
    smooth_engine.cpp
)

find_library(log-lib log)

target_link_libraries(smooth_engine
    ${log-lib}
)
