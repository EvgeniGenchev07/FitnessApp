/* [grial-metadata] id: Grial#NewsSignUpPage.cs version: 1.0.1 */
namespace FitnessApp.Views;

public partial class SignUpPage : ContentPage
{
	public SignUpPage()
	{
		InitializeComponent();
	}

    private void CreateButtonClicked(object sender, EventArgs e)
    {

    }

    private void LoginButtonClicked(object sender, EventArgs e)
    {

    }

    private void OnEyeTapped(object sender, TappedEventArgs e)
    {
        entry.IsPassword = !entry.IsPassword;
        icon.Text = entry.IsPassword ? MaterialCommunityIconsFont.EyeOutline : MaterialCommunityIconsFont.EyeOffOutline;
    }
}
