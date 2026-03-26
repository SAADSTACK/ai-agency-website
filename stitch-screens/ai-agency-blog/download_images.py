#!/usr/bin/env python3
"""
Download images for AI Agency Blog Section Stitch screen
Usage: python download_images.py
"""

import os
import urllib.request
from pathlib import Path

# Image URLs extracted from blog.html
IMAGES = {
    "image-1.jpg": "https://lh3.googleusercontent.com/aida-public/AB6AXuDHhl1GoKx42H6Bqx802CRueFvGLjLIbw7ivEvw3YYuIh1brzs31tUHWWZZSE4wwPt7l_VKZzLUsDaJvP2Sfzc1LZURuTqefG9Y9k6rFYGA2hsy2xBSKSP9U3KuFjr6XLGXw-djTCNyiVq0ePsvgXWfiZ_UnY2NvTvWzPTqzgCpcmxu_7pZwIUYgd0dG2v40aHBJxHGt6qE6Rrm4DZpd05gmYQC2IYZaJCG4D5VzFbtxjKJFGW1mRfEOHP3T0fQFDJpS0YT3cQPzlUI",
    "image-2.jpg": "https://lh3.googleusercontent.com/aida-public/AB6AXuCew8F18U4MpGr4gaSLFLx7TzmuWlY0MIyZIOpg3fOwOzEgGJc6hI3V37MYuMkUBi-X_pUUnQJ3KK30izSOnCSvAHmK1YQ829jGy1nHdSEuxcYz0IIGZDHllFnGkABAm-aYL4q6Swu9tKMFKwjjZkCi33xV4pchNmgk3Z24p5pB4AoiC5_G4Q72-FeFPSzTBSo3Xqa2cgEv65Ajtuz_J0_XHoT66ob-UG-G2h4frHyOYQ3kEhtJy4cYTXBhe1QvmrKDoERU8u6lSO7u",
    "image-3.jpg": "https://lh3.googleusercontent.com/aida-public/AB6AXuCvYPg07HUQ47zxGmkxoY0D8u0dugNhyF7frIv3hylTDc5Q3xLdGSeD70rACLhDSqlu7nefASOy64bXPjOCootJ6XZrqa7KFRlZ5TEXNA4mnVZLojJsRv34HRaQUVUSqt7oBWvrpevsoHTd4bMZ5m8J5NWuB8JTS4DRoEvp5NKU1G6kd5R3WrzC082vju6gcqJEbBjQaT9D-w3SuGbuB6xH4-22O01xQakL-2lJSNn0x_XgpX-qPLy9OJJNkuFydkY5cNUq-TNLdi6f",
    "image-4.jpg": "https://lh3.googleusercontent.com/aida-public/AB6AXuDb6pI-Hx0_rfYIjuEEBg7634Mfv3GoEllM64SyNqT1iW559Vf8kJjcmzye6o8YiXo83CKxwVIm7rgsvt38TZGxd19rh2jAo5k5jdsd7wzWljy9Q5PvNh-YIzO7ij4wTA2tDVZCuSZqrq6vdi_MecEd89WoXRMVYvF05ZZbr_XfCZN5NdEEtR6T7G6ofLlHa0UMzd1d_zn1Br0CMdTNISbh8WKe6qqSI0o38_cZrwGhQEaNju1nNWyIr2LRfUr69WoT-SA1zuqUo-p8",
    "image-5.jpg": "https://lh3.googleusercontent.com/aida-public/AB6AXuAEFAD-Rk47wd0jNGuZp7CzpVLWJIsFRnlczJVUV9K9oup52ImEpP0ndBBqMnBwxK29Z-0ja9tHGFQVETmqjHJFSayXMkqiJqDvd6AxIAJ3b7Wb0LpMpC8AU2yzLiEyI4tz559go-Ou84VvFNQwCME1fNdX8v6nRJNezmdC2hIPV6u49bM5HSf4qhqlRbPZtO16f48dLYDL93OVGQiOi9sBVXPPNx7aZ4b736XJ6bO9u3B0pDFXjnuJkLLoyC2oWIVXgMnpm5lFKsSL",
    "image-6.jpg": "https://lh3.googleusercontent.com/aida-public/AB6AXuA33G-x3qUgug2C2JJbGZeSrdrQ9TrkrEV5rVI2v7yv-KmOZ3DGfew2BLJoQgB1Q9s-brMv69hW2pWjbyWIkT1DJoY-DuDNjMT0OiW0OfdLLH9rAGTxIujgeGgzCTnEPFdEt7BwTEY3-uCUfO0NC__6K982yDI1lHi2zqXIoHdLPvV3NbZQApNvdoa_SKR2wrX6SAxySub1ouWxt1AOAha-r4QhkGSpstM2DbZ1sJPw9xFgQHypy4MnTaPtZGqZz2aTJc2MMOethOYO",
    "image-7.jpg": "https://lh3.googleusercontent.com/aida-public/AB6AXuB1Q8aSmVjTlAFzlEwzOWA2LSKNyX-eF4IL4BFc5lEwz_ZAg8Ixs8-M2pg_qEyUQ2u-P72AgPwzX3hyyU0gHd7Q1AgjEg2M1sj_fe09oAv_JwRa94ewSvkSdp7cmJzknkczEUJzk1H9Gx4bmNpYcE-d-bw1TXsMVXA_lddhF_AAw5ZaufSzC2I-ViReAUy0o5zYyAKfgU-bk7JwwoESvAGuSgHw_QAT9zITX4kZ5gkyZnvkFWimycdKlQY3Ku7d0eo0_xOkmrfn2vbi",
    "image-8.jpg": "https://lh3.googleusercontent.com/aida-public/AB6AXuBUnqYQvDB-IXY2S0Fg3QJP8ZidC1-x4fQvEjUIpx2trC3Nbh7Y2GkBN7ars7bqWcLngGRqQ9VGZL_XyGorQk0vSBbJ0cnlcnyZEp-A7sYDI2q8qOG36vruI5ucPppymZYsyNyeCickZ4Ros1bI-jzHpNK3BtlUWlcAcv7ORjKUAb1Taayt9Lfxc9t6RldaXnZ7V3KKGHgxhs_puwHDfFtxGNxJbp9yFbZk0SGPJ4T5xN1uJ9MFPy4zVc1eulR84puzTiVnoPkJgxpn",
    "image-9.jpg": "https://lh3.googleusercontent.com/aida-public/AB6AXuBVeMCXK1n1nrJmuazqkfbee8VtGrB--NA8gb1OooH2EEX86RLAQrlkC6l_LMy41227uuVfdVsAWgN7jXGMuS5VFmwWYHVIkojjGuK15MYTOmOd4QFqi-3_WtxMz4gaMWeH0HgIV1TSdYs0v34UAnWmTIY4fHTlQN7B4VV_kfPO8-FA3EARyrWJk5hKOcIAWKxLcazZSZsg_n5wb_lhcqHEtPb_TDbxkslij1oWmWGS6U2qICtcygCuK1sZ_8bBVNbvVzA7xQTp6Xof",
    "image-10.jpg": "https://lh3.googleusercontent.com/aida-public/AB6AXuD0inRlmEzqd5p1QMlg6TOTRByLOq7swhloOqobgJkMk0_DOJb8wnwrzhqXMKSeSoDbNU11Q38nZROctU0-r4nyxZuE1fT28KAlGVXWP4gHTOJP7oZU_gpwyFP7I3IiMJStQEN-MDU0k9YbfHOvRsKsD8PXae43U9y2yt3SjkdjUaMFmItkQ6d3ZBYalu_1w8o1EHNvvVR0y7pIodsMGQSEsFOjcKqRyRD0WEJL68_bVg_CQ7ZmlA_G4RZPYYJcxuXbcXgAgi4pfEFI",
    "image-11.jpg": "https://lh3.googleusercontent.com/aida-public/AB6AXuCsNGRMHY0TKTfFhWrU8Y6Y1lZPIJOsCKgEtvuwaz3y6b1GXGSGSOUNk5yhEzqjC_hF3neEF79zYJcolV9EPngjIwHOKSli8iV6OQmEzGUvoY6Lhvy_UQGNG_7NLQQKUrTv6kd_1PFEKWLnpkP1zQrUtNCgTVmNDSdJezVB6BvLourdCpRlAKWOZ4D2QJ9LsVC3NMIEMOVZdLNjqRXynX5hGBtWmanH1fad6O6XyVP86bkMBdT03f4ALGO-G7hWP2ivUckwTjHyHJdV",
    "image-12.jpg": "https://lh3.googleusercontent.com/aida-public/AB6AXuCG2hjFPPhxddbhtX_BuU4hQNvc4sC4WjgCAndqBUuCsqRpz4ZQKXqqlK2FxsAcA8SlfDgcTFRZwYfLt55b6PAvXyio086vE_f5333Y3MqoMZCDGz0UnQ43kT0y8swS6s-97Vkf5Jfb96OyhzJWcqwGbDImoXf6yR0cyCbjcpNge3O0s2PeyOiCX5gVX7cE7Ia8kChMuX7CuENFil4WZgeNaMqExjx83zNoptipovpjzRIbA_jeX3fXVNHAsTElMSIk26NF2xXSO92Z",
    "image-13.jpg": "https://lh3.googleusercontent.com/aida-public/AB6AXuAk1HKskvI8lJ719uSP86HSWNqxyyfow-CcYc84beYlI3lcxzALSssXAmKUD01i3Av2sg6lXmxawiRH9_1_86Zlqxad3WJV1R7fRnwi7YSmzt9hDi23bRqZ0MS0QZiXohF6oysfEvHFI2JdYIExTA_pcX6Ki5-tkztKFlRgLEUWTrhq_mJJfXS1LVS_aLNhXGIWTudPRtb3wJqfxIR3AJaFJ6ceN4NlsRXA9o_sX2nWjUFpDw5dtMMOwmXpPKFd4EEYl-AmMkHrmRmw",
    "image-14.jpg": "https://lh3.googleusercontent.com/aida-public/AB6AXuANNUqmnu2xAVVOYqkLq9N1XR7u6YSxKom7K8tS6sIzo3pzrfaKm3H_h5QFX1fIIr90lS51BFJbdXcizurQ9NzVnDj041qMzhjcondbc2M3uY0I2-VQMX0wyiDjnk9nzCf5c2TtSqMfT8Gfy76SivUbN_5OBKWqVLkdgGBPOq2ebjGoZuobEC4ok6hOSztqAxvXvcKHqEyqvWn_zMVAJ9mT9gCf4FqhyUI9odsoKSlnjkpwnEB1C92eqL9oH8sjqU0Gzn78kqjZ_DZU"
}

def download_images(output_dir="public/images/ai-agency-blog"):
    """Download all images to the specified directory."""
    os.makedirs(output_dir, exist_ok=True)
    
    total = len(IMAGES)
    successful = 0
    failed = 0
    
    for filename, url in IMAGES.items():
        filepath = os.path.join(output_dir, filename)
        
        # Skip if already exists
        if os.path.exists(filepath):
            print(f"Already exists: {filename}")
            successful += 1
            continue
        
        try:
            print(f"Downloading {filename}...", end=" ")
            urllib.request.urlretrieve(url, filepath)
            print("Done")
            successful += 1
        except Exception as e:
            print(f"Error: {e}")
            failed += 1
    
    print(f"\n{'='*50}")
    print(f"Download Summary:")
    print(f"  Total:      {total}")
    print(f"  Successful: {successful}")
    print(f"  Failed:     {failed}")
    print(f"{'='*50}")
    
    return failed == 0

if __name__ == "__main__":
    success = download_images()
    exit(0 if success else 1)
