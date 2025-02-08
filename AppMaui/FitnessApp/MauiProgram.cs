using CommunityToolkit.Maui;
using FitnessApp.ViewModels;
using FitnessApp.Views;
using Microsoft.Extensions.Logging;
using UXDivers.Grial;

namespace FitnessApp
{
    public static class MauiProgram
    {
        public static MauiApp CreateMauiApp()
        {
            var builder = MauiApp.CreateBuilder();
            builder
                .UseMauiApp<App>()
                .UseMauiCommunityToolkit()
                .ConfigureFonts(fonts =>
                {
                    fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                    fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
                    fonts.AddFont("Poppins-Regular.ttf","Poppins");
                    fonts.AddFont("materialdesignicons-webfont.ttf","Material Design Icons");
                })

                .ConfigureMauiHandlers(handlers =>
                {
                    handlers.AddHandler<NavigationPage, UXDivers.Grial.GrialNavigationPageHandler>();
                    handlers.AddHandler<ScrollView, FitnessApp.ScrollViewHandler>();
                    handlers.AddHandler<Label, FitnessApp.LabelHandler>();
                    handlers.AddHandler<Entry, UXDivers.Grial.EntryHandler>();
                })
                .UseGrial();

#if DEBUG
    		builder.Logging.AddDebug();
#endif
            builder.Services.AddTransientWithShellRoute<SignUpPage, SignUpViewModel>(nameof(SignUpPage));
            builder.Services.AddTransientWithShellRoute<LoginPage, LoginViewModel>(nameof(LoginPage));
            return builder.Build();
        }
    }
}
