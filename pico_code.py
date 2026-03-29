import time
import usb_hid
from lib.adafruit_hid.keyboard import Keyboard
from lib.keyboard_layout_win_de import KeyboardLayout as Layout_DE
from lib.keycode_win_de import Keycode
# from lib.adafruit_hid.keyboard_layout_us import KeyboardLayoutUS as Layout_DE
# from lib.adafruit_hid.keycode import Keycode
import board
import busio  

uart = busio.UART(board.GP0, board.GP1, baudrate=115200, timeout=0.2, receiver_buffer_size=4096)
kbd = Keyboard(usb_hid.devices)
layout = Layout_DE(kbd)

def type_text(t: str):
    layout.write(t)

while True:
    line = uart.readline()
    if line:
        time.sleep(0.5)
        #type_text("abcd")
        origin_text = str(line)
        print_text = ""
        idx = 2
        while idx < len(origin_text):
            if origin_text[idx] == '\\':
                if print_text != '':
                    type_text(str(print_text))
                print_text = ''
                if origin_text[idx+1] == 'n':
                    kbd.send(Keycode.ENTER)
                    kbd.send(Keycode.SHIFT, Keycode.TAB)
                elif origin_text[idx+1] == 't':
                    kbd.send(Keycode.TAB)
                idx += 2
            else:
                print_text += origin_text[idx]
                idx += 1         
    time.sleep(0.01)

