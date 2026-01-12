import pytesseract
from PIL import Image

class OCRService:
    """
    A service class for performing OCR (Optical Character Recognition) on images.
    """

    @staticmethod
    def extract_text_from_image(image_file) -> str:
        """
        Extract text from an image file using OCR.

        Args:
            image_path: The path to the image file.
            """
        try:
            image = Image.open(image_file)
            text = pytesseract.image_to_string(image)
            return text
        except Exception as e:
            raise RuntimeError(f"OCR error:{e}")
