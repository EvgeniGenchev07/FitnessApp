$(document).ready(function() {
    // Image preview functionality
    $('#image').on('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Check if file is an image
            if (!file.type.match('image.*')) {
                alert('Please select an image file (JPEG, PNG, etc.)');
                $(this).val('');
                return;
            }
            
            // Check file size (e.g., 5MB max)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                $(this).val('');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(event) {
                $('#imagePreview').attr('src', event.target.result).show();
                $('.close-preview').show();
            }
            reader.readAsDataURL(file);
        }
    });

    // Close preview button
    $('.close-preview').on('click', function() {
        $('#imagePreview').hide().attr('src', '');
        $('#image').val('');
        $(this).hide();
    });

    // Also handle when user selects the same file again (to reset if needed)
    $('#image').on('click', function() {
        if ($('#imagePreview').is(':visible')) {
            // Optional: Add confirmation if you want
            // return confirm('Changing the image will remove the current preview. Continue?');
        }
    });
});