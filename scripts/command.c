#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    printf("Hello, World!\n");
    return 0;
}

void create_module() {
    // Module creation logic here
}

void create_test_module() {
    // Test module creation logic here
}

void delete_module() {
    // Module deletion logic here along with its testbench
}

void test_module() {
    // Module testing logic here
    // Add message to terminal that waveform is generated in sim folder.
}

void convert_to_netlist() {
    // Logic to convert RTL to netlist
    // Add message to terminal that .v file is generated in netlist folder.
}