/* [grial-metadata] id: Grial#NewsSourceProfilePage.cs version: 1.0.1 */
namespace FitnessApp.Views;

public partial class SourceProfilePage : ContentPage
{
	public SourceProfilePage()
	{
		InitializeComponent();

        BindingContext = new SourceProfileViewModel();
    }
}
