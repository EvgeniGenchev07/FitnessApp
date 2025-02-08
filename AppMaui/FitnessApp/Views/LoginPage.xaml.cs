/* [grial-metadata] id: Grial#NewsLoginPage.cs version: 1.0.1 */
namespace FitnessApp.Views;

public partial class LoginPage : ContentPage
{
	public LoginPage()
	{
		InitializeComponent();
	}

    private void LoginButtonClicked(object sender, EventArgs e)
    {

    }

    private void SignupButtonClicked(object sender, EventArgs e)
    {

    }

    private void OnEyeTapped(object sender, TappedEventArgs e)
    {
        entry.IsPassword = !entry.IsPassword;
        icon.Text = entry.IsPassword ? MaterialCommunityIconsFont.EyeOutline : MaterialCommunityIconsFont.EyeOffOutline;
    }
}
