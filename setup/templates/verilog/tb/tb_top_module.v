`timescale 1ns/1ps   // Time unit / time precision

module tb_top_module();  // Testbench module has no ports

    // Declare signals to connect to DUT (Device Under Test)
    // TODO: declare input/output signals here

    top_module dut (
        // TODO: connect signals to dut
    );
   
    // Clock generation
    // TODO: add clock generation if needed

    // Test stimulus
    initial begin
        // TODO: initialize input signals here

        // TODO: add test stimulus here
        $finish;
    end

    // Waveform dump
    initial begin
        $dumpfile("sim/wave.vcd");  // VCD file in sim directory
        $dumpvars(0, tb_top_module);
    end

endmodule
