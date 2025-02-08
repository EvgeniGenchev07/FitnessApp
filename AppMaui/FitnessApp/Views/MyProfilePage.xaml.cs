/* [grial-metadata] id: Grial#NewsMyProfilePage.cs version: 1.0.1 */
namespace FitnessApp.Views;

public partial class MyProfilePage : ContentPage
{
	public MyProfilePage()
	{
		InitializeComponent();

        BindingContext = new MyProfileViewModel();
    }
}
