`timescale 1ns/1ps   // Time unit / time precision

module tb_top_module();  // Testbench module has no ports

    // Declare signals to connect to DUT (Device Under Test)

    // Instantiate the DUT
    top_module dut ();

    // Clock generation
    initial begin
        clk = 0;
        forever #5 clk = ~clk;  // 10ns clock period
    end

    // Test stimulus
    initial begin
        // Initialize signals

        // Release reset after some time
        #20;
        rst = 0;

        // Apply test vectors

        // Finish simulation
        $finish;
    end

    // Waveform dump
    initial begin
        $dumpfile("tb_top_module.vcd");  // VCD file in sim directory
        $dumpvars(0, tb_top_module);
    end

endmodule
