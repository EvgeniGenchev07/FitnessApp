/* [grial-metadata] id: Grial#NewsLoginPage.cs version: 1.0.1 */
using FitnessApp.ViewModels;

namespace FitnessApp.Views;

public partial class LoginPage : ContentPage
{
	public LoginPage(LoginViewModel viewModel)
	{
		InitializeComponent();
        icon.Text = MaterialCommunityIconsFont.EyeOutline;
        BindingContext = viewModel;

    }


    private void OnEyeTapped(object sender, TappedEventArgs e)
    {
        entry.IsPassword = !entry.IsPassword;
        icon.Text = entry.IsPassword ? MaterialCommunityIconsFont.EyeOutline : MaterialCommunityIconsFont.EyeOffOutline;
    }
}
