# Oracle Compute Instance Creator - Firefox Extension

A Firefox extension that continuously attempts to create an Oracle Cloud Infrastructure (OCI) free tier compute instance.

## How to Use

1. **Prerequisites:**
    *   You should have an Oracle Cloud account.
    *   Familiarize yourself with the process of creating a compute instance on OCI. Refer to the blog post: [How to set up and run a really powerful free Minecraft server in the cloud](https://blogs.oracle.com/developers/post/how-to-set-up-and-run-a-really-powerful-free-minecraft-server-in-the-cloud) (While the blog focuses on a Minecraft server, the compute instance creation steps are relevant).

2. **Installation:**
    *   Download the extension files (or clone the repository).
    *   Open Firefox and type `about:debugging` in the address bar.
    *   Click "This Firefox" on the left.
    *   Click "Load Temporary Add-on...".
    *   Select the `manifest.json` file from the extension files.

3. **Configuration:**
    *   Navigate to the Oracle Cloud instance creation page: [https://cloud.oracle.com/compute/instances/create](https://cloud.oracle.com/compute/instances/create)
    *   Fill in all the required fields for your compute instance as per your requirements and the blog post instructions.
    *   Click the extension icon in the Firefox toolbar. This will open the extension popup.
    *   You can configure the following settings:
        *   **Interval (seconds):** The time in seconds between each attempt to create an instance (default: 30). You can change this value and click "Update" to adjust the interval on the fly. Valid range is between 10 and 300.
        *   **First AD:** First availability domain.
        *   **Second AD:** Second availability domain.

4. **Running the Extension:**
    *   Click the "Start" button in the extension popup.
    *   The extension will now continuously attempt to create an instance by clicking the "Create" button on the Oracle Cloud page at the specified interval.
    *   **Important:** A new popup window will open, don't close this!

5. **Monitoring:**
    *   (Optional) You can open the Firefox developer tools (F12) and go to the "Console" tab to see log messages. Filter the logs by "***" to only show messages from the extension.
    *   It's advised to close the developer tools while the script is running to prevent potential performance issues over long periods.

## Notes

*   **DO NOT CLOSE THE POPUP WINDOW!** The extension uses it for session management.
*   Ensure your computer does not go to sleep while the extension is running.
*   The extension will try each Availability Domain in the order you enter them.
*   This extension is provided as-is and might require adjustments depending on changes to the Oracle Cloud interface.

## Disclaimer

This extension is not affiliated with or endorsed by Oracle. Use it at your own risk. The availability of free tier resources is subject to Oracle's terms and conditions.

## TODO

* fix the pause button because currently it doesn't update to display "pause" after you press "start"
